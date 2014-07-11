var asimov = require('asimov');
var Base = require('asimov').Base;
var _super = Base.prototype;
var _ = require('lodash');
var tcpPortUsed = require('tcp-port-used');

var cluster = require('cluster');
var count = require('os').cpus().length;
var limit = 4;
count = count > limit ? limit : count;
count = count < 2 ? 2 : count;

function numberWithCommas (x) {

  var tail = '';
  if (x > 999999) {
    x = Math.floor(x / 1000);
    tail = 'k';
  }
  return (x || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + tail;
}

module.exports = Base.extend({

  'namespace': 'server',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.started = new Date();

    self.allowRespawn = true;

    self.workers = {};
    self.requestCounts = {};
    self.totalRequestCount = 0;

    // self.bindTo(asimov, 'set:public:serverVariables', 'transmitVariables');
  },

  'onMessage': function (data) {

    var self = this;
    var timeout = asimov.config('server.workerReportInterval');
    var limit = 60 / timeout;

    var counts = self.requestCounts[data.pid] || [];
    counts.push(data.requestCount || 0);
    counts = _.last(counts, limit);
    self.requestCounts[data.pid] = counts;

    self.totalRequestCount += data.requestCount || 0;
  },

  'logRunning': function (data) {

    var self = this;
    var timeout = asimov.config('server.logInterval') * 1000;
    var total = 0;

    if (asimov.config('state') === 'stopping') return false;

    var since = (new Date()).valueOf() - self.started.valueOf();

    if (since < timeout) {
      return setTimeout(self.logRunning, 500);
    }

    _.each(self.workers, function (worker, pid) {
      _.each(self.requestCounts[pid], function (count) {
        total += count;
      });
    });

    var now = (new Date()).valueOf();
    var delta = (now - self.started) / 1000;
    var days = Math.floor(delta / 86400);
    var hours = Math.floor(delta / 3600) % 24;
    var minutes = Math.floor(delta / 60) % 60;
    var seconds = Math.round(delta % 60);

    var reqPerSecond = false;
    if (total > 1000) {
      reqPerSecond = true;
      total = Math.round(total / 60);
    }

    var time = '';
    days && (time += days + 'd ');
    hours && (time += hours + 'h ');
    minutes && (time += minutes + 'm ');
    seconds && (time += seconds + 's ');

    var message = 'Running ' + time.trim() + ', received ' + numberWithCommas(self.totalRequestCount) + ' requests, throughput ' + numberWithCommas(total) + ' req/';
    message += reqPerSecond ? 'sec' : 'min';
    self.logger.log(self.namespace, message);

    setTimeout(self.logRunning, timeout);
  },

  'start': function () {

    var self = this;
    self.started = new Date();
    var port = asimov.config('server.port');

    cluster.on('exit', self.respawnWorker);

    asimov.shutdown(self.killCluster);

    function initWorkers () {

      var message = 'Started server cluster with ' + count + ' workers @ http://127.0.0.1:' + port;
      self.logger.since(self.namespace, message, self.started);
      self.bindOnceTo(asimov, 'app:started', 'logRunning');

      for (var i = 0; i < count; i++) {
        self.spawnWorker();
      }
    }

    tcpPortUsed.check(port).then(function (portInUse) {

      if (portInUse) {

        self.logger.pending(self.namespace, 'Port ' + port + ' is not available, standing by to start server cluster');

        var interval = 500;
        var sTimeout = 30;
        var msTimeout = sTimeout * 1000;

        tcpPortUsed.waitUntilFree(port, interval, msTimeout).then(initWorkers, function () {
          asimov.error('Failed to bind to port ' + port + ' within ' + sTimeout + ' seconds');
        });
      }
      else {
        initWorkers();
      }
    });
  },

  'setInterfaceVariable': function (key, value) {

    console.log('setInterfaceVariable', key, value);
  },

  'killCluster': function () {

    var self = this;

    self.allowRespawn = false;
    _.each(self.workers, self.respawnWorker);
  },

  'spawnWorker': function () {

    var self = this;
    var worker = cluster.fork();

    self.workers[worker.process.pid] = worker;
    worker.on('message', self.onMessage);

    return worker;
  },

  'respawnWorker': function (worker) {

    var self = this;
    worker.removeAllListeners();

    if (!self.allowRespawn) return;

    self.logger.pending(self.namespace, 'Worker process ' + worker.process.pid + ' died, respawning');

    setTimeout(self.spawnWorker, 100);
    delete self.workers[worker.process.pid];
  }
});
