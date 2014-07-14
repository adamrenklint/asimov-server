var asimov = require('asimov');
var Master = require('../Master');
var Worker = require('../Worker');

var isWorker = asimov.config('IS_SERVER_WORKER');

var constructor = isWorker ? Worker : Master;
var instance = new constructor();

module.exports = function initCluster (next) {

  instance.start();
  next();
};
