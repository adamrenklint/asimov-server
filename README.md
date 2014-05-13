asimov-server
================

[![NPM version](https://badge.fury.io/js/asimov-server.png)](http://badge.fury.io/js/asimov-server)
[![Build Status](https://travis-ci.org/adamrenklint/asimov-server.png?branch=master)](https://travis-ci.org/adamrenklint/asimov-server) [![Code Climate](https://codeclimate.com/github/adamrenklint/asimov-server.png)](https://codeclimate.com/github/adamrenklint/asimov-server) [![Dependency Status](https://david-dm.org/adamrenklint/asimov-server.png?theme=shields.io)](https://david-dm.org/adamrenklint/asimov-server)

**High performance static server cluster plugin for [asimov.js](http://asimovjs.org)**

## How it works

The server is built as a high-performance companion for the [asimov-pages](http://asimovjs.org/docs/pages) static site generator, and uses a cluster of workers to serve static pages. To customize the request/response flow, you can use express.js compatible middleware.

## Getting started

### Install from npm

    $ npm install --save asimov-server

### Include in your project

```javascript
var server = require('asimov-server');
asimov.use(server());
```

## Options

```javascript
asimov.use(server({
  'src': 'build' // source directory for static pages and assets
}));
```

## Middleware

A middleware file exports a middleware factory, to which you can pass options. The factory function should return the actual middleware callback, which is normal express.js middleware.

```javascript
module.exports = function myMiddlewareFactory (options) {
  // do some config with options
  return function myMiddleware (req, res, next) {
    // do some logic
    next()
  };
};
```

Then include and register the middleware in your project.

```javascript
var myMiddleware = require('myMiddleware');
asimov.middleware(myMiddleware());
```

### Pre and post middleware

It is possible to hook into several different steps in the request handling lifecycle.

Pre-middleware is executed before any other middleware and could be used to override the enire normal request lifecycle and middleware chain.

```javascript
var overrideEverything = require('overrideEverything');
asimov.premiddleware(overrideEverything());
```

You can also hook in middleware right after the server has tried to serve content from the static source folder, if no content was found. With this you could, for example, add a custom logger to keep track of the amount of served 404s.

```javascript
var myCustom404Logger = require('myCustom404Logger');
asimov.postmiddleware(myCustom404Logger());
```

Beware, when the pre-middleware is executed, the response will not have been equiped with any caching headers yet, so if you send a response, you might want to take of this on your own.

---

## Develop

First, fork this repo. Obviously.

### Install dependencies

    $ npm install

### Run tests

    $ npm test

### Publish to npm

    $ make publish

---

Made by [Adam Renklint](http://adamrenklint.com), Berlin 2014. [MIT licensed](https://github.com/adamrenklint/asimov.js/blob/master/LICENSE).
