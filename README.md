asimov-server
================

[![NPM version](https://badge.fury.io/js/asimov-server.png)](http://badge.fury.io/js/asimov-server)
[![Build Status](https://travis-ci.org/adamrenklint/asimov-server.png?branch=master)](https://travis-ci.org/adamrenklint/asimov-server) [![Code Climate](https://codeclimate.com/github/adamrenklint/asimov-server.png)](https://codeclimate.com/github/adamrenklint/asimov-server) [![Dependency Status](https://david-dm.org/adamrenklint/asimov-server.png?theme=shields.io)](https://david-dm.org/adamrenklint/asimov-server)

**A high performance static server cluster plugin for [asimov.js](http://asimovjs.org)**

Made by [Adam Renklint](http://adamrenklint.com), Berlin 2014. [MIT licensed](https://github.com/adamrenklint/asimov-server/blob/master/LICENSE).

[asimov-server](http://asimovjs.org/docs/server) is a high-performance static server based on [express.js](http://expressjs.com/). It uses a cluster of workers to serve a static site built with [asimov-pages](http://asimovjs.org/docs/pages) and allows you to customize the request/response flow with express.js middleware.

## Getting started

First things first - create a new, [basic project](https://github.com/adamrenklint/asimov.js/blob/master/README.md#create-a-new-project). Then install asimov-server from npm.

```
$ npm install --save asimov-server
```

To use the server plugin, add it in your app's plugin hook, in ```index.js``` and start your app with ```asimov``` or ```node index.js```.

```javascript
var asimov = require('asimov');
var server = require('asimov-server');

// Keeping all our setup in this format allows our
// app to be used as a plugin by other projects
module.exports = function pluginFactory (options) {
  return function plugin () {
    asimov.use(server(options));
  }
};

// The project bootstrap, using our app as a plugin
module.exports.start = function bootstrap () {
  asimov
    .use(module.exports())
    .start();
};

// If we are not loaded as a plugin, start the app
module.parent || module.exports.start();
```

## Options

```javascript
asimov.use(server({
  'src': 'public' // source directory for static pages and assets
}));
```

## Middleware

A middleware file exports a *middleware factory*, to which you can pass options. The factory function should return the actual *middleware callback*, which is normal express.js middleware.

```javascript
// lib/middleware/myMiddleware.js
module.exports = function myMiddlewareFactory (options) {
  // do some config with options
  return function myMiddleware (req, res, next) {
    // do some logic
    next()
  };
};
```

Then include and register the middleware in your project. To keep the plugin hook nice and tidy, always add your middleware inside of an initializer.

```javascript
// lib/init/myMiddlewareInit.js
var myMiddleware = require('../middleware/myMiddleware');
module.exports = function plugin (options) {
  asimov.middleware(myMiddleware(options));
};
```

And load the initializer in the plugin hook.

```javascript
// index.js
var myMiddlewareInit = require('./lib/init/myMiddlewareInit');
module.exports = function pluginFactory (options) {
  return function plugin () {
    asimov.init(myMiddlewareInit(options));
  };
};
```

### Pre and post middleware

It is possible to hook into several different steps in the request handling lifecycle.

*Pre-middleware* is executed before any other middleware and could be used to override the entire normal request lifecycle and middleware chain.

```javascript
var overrideEverything = require('overrideEverything');
asimov.premiddleware(overrideEverything());
```

With *post-middleware*, you also hook in middleware right after the server has tried to serve content from the static source folder, if no content was found. With this you could, for example, add a custom logger to keep track of the amount of served 404s.

```javascript
var myCustom404Logger = require('myCustom404Logger');
asimov.postmiddleware(myCustom404Logger());
```

Beware, when the pre-middleware is executed, the response will not have been equipped with any caching headers yet, so if you send a response, you might want to take of that on your own.

---

## Develop and contribute

1. First, fork this repo.
2. Implement something awesome
3. Write tests and run them with ```npm test```
4. Submit a pull request

### Credits

Author: [Adam Renklint](http://adamrenklint.com).
