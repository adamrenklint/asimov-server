var asimov = require('asimov');
var cluster = require('cluster');
var uuid = require('node-uuid');
var worker_queue = {};
var handlers = [];

process.on('message', handleReturningMessage);
asimov.on('server:worker:message', handleIncomingDataRequest);

function requestData (data, callback) {
  var server = asimov.config('server.instance');
  data = data || {};
  data.uid = uuid.v1();
  data.pid = cluster.worker.process.pid;

  worker_queue[data.uid] = callback;
  process.send(data);
}

function handleReturningMessage (data) {
  var callback = worker_queue[data.uid];
  delete worker_queue[data.uid];

  if (callback && typeof callback === 'function') {
    callback(data);
  }
}

function handleIncomingDataRequest (payload) {
  var _handlers = handlers.slice();

  function next (data) {
    var handler = _handlers.shift();
    if (!handler) {
      var server = asimov.config('server.instance');
      server.sendToWorker(data);
    }
    else {
      handler(data, next);
    }
  }

  next(payload);
}

function handleDataRequest (callback) {
  handlers.push(callback);
}

exports.requestData = requestData;
exports.handleDataRequest = handleDataRequest;