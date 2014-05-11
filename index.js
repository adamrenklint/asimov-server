var asimov = require('asimov');
var middleware = require('./lib/init/middleware');

module.exports = function (options) {

  options = options || {};

  // declare the default options

  return function () {

    [
      'premiddleware',
      'middleware',
      'postmiddleware'
    ].forEach(function (name) {
      asimov.addSequence(name);
    });

    asimov.init(middleware(options));
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

module.exports.start = function start (next) {
  asimov
    .use(module.exports())
    .start(next);
};

module.parent || module.exports.start();
