var test = require('asimov-test');
var index = require('../index');

test('module index', function (test) {

  test.it('should export a bootstrap function', function () {

    expect(index.start).to.be.a('function');
  });

  [
    'Cluster',
    'Worker'
  ].forEach(function (name) {

    test.it('should expose the "' + name + '" class', function () {

      expect(index[name]).to.be.a('function');
    });
  });
});
