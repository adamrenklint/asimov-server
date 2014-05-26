var asimov = require('asimov');
var Base = require('asimov').Base;
var _super = Base.prototype;
var express = require('express');
var liveReload = require('./liveReload');
var cluster = require('cluster');

process.env.PORT = process.env.PORT || 3003;

module.exports = Base.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.bindTo(process, 'message', 'onMessage');
    // self.middleware = {};
    // self.middlewarePaths = {};

    self.state = {};
  },

  'onMessage': function (data) {

    var self = this;

    if (data.url) {
      self.state[data.url] = data;
    }
  },

  'start': function () {

    var self = this;
    var app = self.app = express();

    // console.log(cluster.worker.id, cluster.worker.workerID, cluster.worker.uniqueID)



    // this is throwing errors when sending SIGHUP to the master process
    // may have to roll my own liveReload, that runs independently
    // of server and pages plugins - but later

    // try {
      // liveReload(app);
    // }
    // catch (e) {
    //   console.log(e)
    // }

    var middleware = self.getMiddleware();

    middleware.forEach(function (fn) {
      app.use(fn);
    });

    // try {
    //
    // }
    // catch (e) {
    //   console.log('not working')
    // }


    app.listen(asimov.config('server.port'));
    self.logToMaster();
  },

  'getMiddleware': function () {

    var self = this;
    return [];
  },

  'logToMaster': function () {

    var self = this;
    var timeout = asimov.config('server.workerReportInterval');

    process.send({
      'pid': cluster.worker.process.pid,
      'requestCount': self.requestCount
    });

    self.requestCount = 0;

    self.delay(function () {
      self.logToMaster();
    }, 1000 * timeout);
  }
});
