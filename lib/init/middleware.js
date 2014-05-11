var asimov = require('asimov');

function getMiddleware (name, options) {
  return require('../middleware/' + name)(options);
}

module.exports = function () {

  return function (next) {

    // add the standard middleware

    next();
  };
};
