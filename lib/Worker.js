var asimov = require('asimov');
var Base = require('asimov').Base;
var _super = Base.prototype;
var express = require('express');
var liveReload = require('./liveReload');
var cluster = require('cluster');
var notFound = require('./middleware/notFound');
var staticAsset = require('static-asset');

process.env.PORT = process.env.PORT || 3003;

module.exports = Base.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.bindTo(process, 'message', 'onMessage');
    self.bindTo(process, 'exit', 'stop');

    // self.middleware = {};
    // self.middlewarePaths = {};

    self.requests = {
      'received': 0,
      'notFound': 0
    };

    self.data = {};
  },

  'onMessage': function (data) {

    var self = this;

    if (data.url) {
      self.data[data.url] = data;
    }
  },

  'start': function () {

    var self = this;
    var app = express();

    liveReload(app);

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
