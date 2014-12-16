var asimov = require('asimov');
var Base = require('asimov').Base;
var _super = Base.prototype;

var express = require('express');
var liveReload = require('./liveReload');
var cluster = require('cluster');
var notFound = require('./middleware/notFound');
var staticAsset = require('static-asset');
var compression = require('compression');

process.env.PORT = process.env.PORT || 3003;

module.exports = Base.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.bindTo(process, 'message', 'onMessage');
    self.bindTo(process, 'exit', 'stop');

    self.requests = {
      'received': 0,
      'notFound': 0
    };

    self.data = {};
    asimov.config('server.data', self.data);

    self.registerMiddleware();
  },

  'registerMiddleware': function () {

    var sourceDir = asimov.config('server.sourceDir');
    asimov.postmiddleware(staticAsset(sourceDir, staticAsset.strategies.etag));

    var compress = compression();
    asimov.postmiddleware(compress);

    // TODO: move this into it's own middleware - the top {n} files
    // could be kept in memory and served directly. need to fix the
    // response headers, though. this together with moving other assets
    // to CDN with a plugin will make shit blazing fast

    // var index = asimov.fs.readFile(sourceDir + '/index.html');
    // asimov.postmiddleware(function (req, res, next) {
    //
    //   res.send(index.toString());
    // });

    asimov.postmiddleware(express.static(sourceDir));
  },

  'onMessage': function (data) {

    var self = this;

    if (data.name) {
      self.data[data.name] = data;
    }

    asimov.config('server.data', self.data);
  },

  'start': function () {

    var self = this;
    var app = express();

    // TODO: move livereload to pages? or separate module?
    // liveReload(app);

    var middleware = self.getMiddleware();

    middleware.forEach(function (fn) {
      app.use(fn);
    });

    self.app = app.listen(asimov.config('server.port'));
    self.logToMaster();
  },

  'stop': function () {

    var self = this;
    var app = self.app;

    app && app.close();
  },

  'getMiddleware': function () {

    var self = this;
    return [].concat(
      self.setupRequest,
      asimov.getSequence('premiddleware'),
      asimov.getSequence('middleware'),
      asimov.getSequence('postmiddleware'),
      self.count404,
      notFound
    );
  },

  'setupRequest': function (req, res, next) {

    var self = this;

    if (req.url.indexOf('/health') === 0) {
      return res.send({});
    }

    self.requests.received++;
    res.setHeader('X-Powered-By', 'asimov.js');

    next();
  },

  'count404': function (req, res, next) {

    var self = this;
    self.requests.notFound++;
    next();
  },

  'logToMaster': function () {

    var self = this;
    var timeout = asimov.config('server.workerReportInterval');

    process.send({
      'pid': cluster.worker.process.pid,
      'requestCount': self.requests.received,
      'notFoundCount': self.requests.notFound
    });

    self.requests.received = 0;

    self.delay(function () {
      self.logToMaster();
    }, 1000 * timeout);
  }
});
