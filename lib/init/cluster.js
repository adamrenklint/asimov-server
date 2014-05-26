var asimov = require('asimov');
var Master = require('../Master');
var Worker = require('../Worker');

module.exports = function initCluster (next) {

  var isWorker = asimov.config('IS_SERVER_WORKER');

  var constructor = isWorker ? Worker : Master;
  var instance = new constructor();

  instance.start();

  // Only continue the initialization chain if we're not the
  // server worker, which has it's own sidechain of initializers
  isWorker || next();
};
