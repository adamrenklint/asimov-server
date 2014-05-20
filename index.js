var cl = require('cluster');
// TODO: this should be done with env.ROLE === 'server_worker'
// Needs to be defined right away, to mute server workers from startup logs
global.muteLog = cl.isWorker;

var asimov = require('asimov');
asimov.isWorker = cl.isWorker;

module.exports = function plugin () {

  [
    'premiddleware',
    'middleware',
    'postmiddleware'
  ].forEach(function (name) {
    asimov.addSequence(name);
  });

  asimov
    .config('server.sourceDir', process.cwd() + '/public')
    .config('server.logInterval', 15)
    .config('server.workerReportInterval', 5)
    .middleware(require('./lib/middleware/notFound'))
    .postinit(require('./lib/init/cluster'));
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
    .use(module.exports)
    .start(next);
};

module.parent || module.exports.start();
