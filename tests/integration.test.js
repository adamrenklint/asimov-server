var test = require('asimov-test');

test('integration /index.html', function (test) {

  test.integration('/', function () {

    test.itShould.loadPage();
  });
});

test('integration /health', function (test) {

  test.integration('/health', function () {

    test.itShould.loadPage();
  });
});