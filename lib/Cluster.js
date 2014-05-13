var Base = require('asimov').Base;
var _super = Base.prototype;

var cluster = require('cluster');
var count = require('os').cpus().length;

module.exports = Base.extend({

  'namespace': 'server',

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.workers = {};
    self.requestCounts = {};
    self.totalRequestCount = 0;

    // self.bindTo(self.options.pages, 'change:rendered', 'transmitPageChange');
    // self.bindOnceTo(self.mediator, 'app:started', 'logRunning');
  },


  'start': function () {

    var self = this;
    self.started = new Date();

    self.logger.pending(self.namespace, 'Starting server cluster with ' + count + ' workers');

    cluster.on('exit', self.respawnWorker);

    for (var i = 0; i < count; i++) {
      self.spawnWorker();
    }
  },

  'spawnWorker': function () {

    var self = this;
    var worker = cluster.fork();

    self.workers[worker.process.pid] = worker;
    // worker.on('message', self.onMessage);

    return worker;
  },

  'respawnWorker': function (worker) {

    var self = this;
    worker.removeAllListeners();

    self.logger.pending(self.namespace, 'Worker process ' + worker.process.pid + ' died, respawning');

    setTimeout(self.spawnWorker, 100);
    delete self.workers[worker.process.pid];
  }
});
