var asimov = require('asimov');
var livereload = require('express-livereload');

module.exports = function (app) {

  if (asimov.config('server.liveReload')) {
    // Kind of a hack, since we only want to run livereload once,
    // running on one port. Will work on everything served from
    // each server fork though, since they all include the js file
    try {
      livereload(app, {
        'watchDir': asimov.config('server.sourceDir'),
        'port': asimov.config('server.liveReloadPort')
      });
    }
    catch (e) {}
  }
};
