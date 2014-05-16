var asimov = require('asimov');
var Cluster = require('../Cluster');
var Worker = require('../Worker');

module.exports = function (options) {

  return function (next) {

    var constructor = asimov.isWorker ? Worker : Cluster;
    var instance = new constructor();

    instance.start();

    asimov.isWorker || next();
  };
};
