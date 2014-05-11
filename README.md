asimov-server
================

[![NPM version](https://badge.fury.io/js/asimov-pages.png)](http://badge.fury.io/js/asimov-pages)
[![Build Status](https://travis-ci.org/adamrenklint/asimov-pages.png?branch=master)](https://travis-ci.org/adamrenklint/asimov-pages) [![Code Climate](https://codeclimate.com/github/adamrenklint/asimov-pages.png)](https://codeclimate.com/github/adamrenklint/asimov-pages) [![Dependency Status](https://david-dm.org/adamrenklint/asimov-pages.png?theme=shields.io)](https://david-dm.org/adamrenklint/asimov-pages)

**A high performance static server cluster plugin for [asimov.js](http://asimovjs.org)**

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

A middleware file exports a middleware factory, to which you can pass options. It should return the actual middleware callback, which is normal express.js middleware.

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

It is possible to hook into several different steps in the request handling lifecycle. For most usecases, normal middleware is just fine. These are executed right before the static server checks the filesystem and returns any public files it finds.

But let's say you have a middleware that executes an http request, and renders a page or json response. Having each static page and asset request go through this would slow things down, so a better idea would be to register this as post middleware.

```javascript
var myApiProxy = require('myApiProxy');
asimov.postmiddleware(myApiProxy());
```

You can also register middleware that executes before any other middleware, and possibly override the entire middleware chain.

```javascript
var overrideEverything = require('overrideEverything');
asimov.premiddleware(overrideEverything());
```

Beware, at this point the response will not have any caching headers, so if you send a response, you need to take care of that on your own. Pre-middleware is in most cases the wrong choice, and you should register your middleware with the normal ```asimov.middleware()``` method.


---

Made by [Adam Renklint](http://adamrenklint.com), Berlin 2014. [MIT licensed](https://github.com/adamrenklint/asimov.js/blob/master/LICENSE).
