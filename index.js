var cl = require('cluster');
global.muteLog = cl.isWorker;

var asimov = require('asimov');
asimov.isWorker = cl.isWorker;
var middleware = require('./lib/init/middleware');
var cluster = require('./lib/init/cluster');

module.exports = function pluginFactory (options) {

  options = options || {};

  // declare the default options

  return function plugin () {

    asimov.config.serverLogDelay = asimov.config.serverLogDelay || 'x';

    [
      'premiddleware',
      'middleware',
      'postmiddleware'
    ].forEach(function (name) {
      asimov.addSequence(name);
    });

    asimov
      .init(middleware(options))
      .postinit(cluster(options));
  };
};

// Export public classes
[
  'Cluster',
  'Worker'
].forEach(function (path) {

  var name = path.split('/').pop();
  module.exports[name] = require('./lib/' + path);
});

module.exports.start = function bootstrap (next) {

  asimov
    .use(module.exports())
    .start(next);
};

module.parent || module.exports.start();
