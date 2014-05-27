var cl = require('cluster');
if (cl.isWorker) process.env.ROLE = 'server_worker';

var asimov = require('asimov');
asimov.config('IS_SERVER_WORKER', cl.isWorker);

module.exports = function plugin () {

  [
    'premiddleware',
    'middleware',
    'postmiddleware'
  ].forEach(function (name) {
    asimov.addSequence(name);
  });

  var port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3003;

  asimov
    .config('server.sourceDir', process.cwd() + '/public')
    .config('server.logInterval', 15)
    .config('server.workerReportInterval', 5)
    .config('server.port', port)
    .config('server.liveReload', true)
    .config('server.liveReloadPort', port + 100)
    .postinit(require('./lib/init/cluster'));
};

// Export public classes
[
  'Master',
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
