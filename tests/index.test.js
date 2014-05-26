var test = require('asimov-test');
var index = require('../index');

test('module index', function (test) {

  test.it('should export a bootstrap function', function () {

    expect(index.start).to.be.a('function');
  });

  [
    'Master',
    'Worker'
  ].forEach(function (name) {

    test.it('should export the "' + name + '" class', function () {

      expect(index[name]).to.be.a('function');
    });
  });
});
