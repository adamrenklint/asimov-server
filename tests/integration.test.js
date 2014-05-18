var test = require('asimov-test');
// var index = require('../index');

test('integration /index.html', function (test) {

  test.integration('/', function () {

    test.itShould.loadPage();
  });
  // test.it('should export a bootstrap function', function () {
  //
  //   expect(index.start).to.be.a('function');
  // });
  //
  // [
  //   'Cluster',
  //   'Worker'
  // ].forEach(function (name) {
  //
  //   test.it('should export the "' + name + '" class', function () {
  //
  //     expect(index[name]).to.be.a('function');
  //   });
  // });
});
