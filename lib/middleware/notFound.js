module.exports = function (req, res, next) {

  console.log('foooo', req.url);
  process.exit();
};
