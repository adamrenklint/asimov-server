# Changelog

## 1.3.0

- **Released Tuesday December 16th, 2014 @ 5.10pm**
- A server worker process (i.e. middleware) can request and wait for data from its master process, using ```asimov.requestData(query, callback)``` and ```asimov.handleDataRequest(function (data, next) {})```

## 1.2.0

- **Released Tuesday December 16th, 2014 @ 3.30pm**
- Send data from worker process to server worker with ```asimov.trigger("public:serverVariables", "baz", { "foo": "bar" })```, will be available with ```asimov.config("server.data").baz.foo```

## 1.1.0

- **Released Friday November 28th, 2014 @ 5.55pm**
- Update [asimov](http://github.com/adamrenklint/asimov) to v1.1.0
- Update [asimov-test](http://github.com/adamrenklint/asimov-test) to v0.3.0

## 1.0.0

- **Released Saturday September 27th, 2014 @ 10.15pm**
- Version 1.0 means the API is stable, and all future additions and changes will follow semantic versioning

## 0.1.5

- **Released Wednesday July 30th, 2014 @ 7.30pm**
- Expose /health endpoint for service discovery

## 0.1.4

- **Released Monday July 14th, 2014 @ 1.55pm**
- Simplified cluster post-initializer, fixes issue where added middleware is always executed before the standard middlewares

## 0.1.3

- **Released Friday July 11th, 2014 @ 2.25pm**
- Stop logging progress if ```asimov.config('state')``` is ```stopping```

## 0.1.2

- **Released Saturday May 31st, 2014 @ 9.25pm**
- Fix issue with cluster workers not being properly killed when receiving SIGINT or SIGTERM signal

## 0.1.1

- **Released Saturday May 31st, 2014 @ 2.20pm**
- Use asimov 0.19.3, fixes issue with env.PORT not being respected [#3](https://github.com/adamrenklint/asimov-server/issues/3)
- Improved logger, starts rounding request count to thousands after a million requests

## 0.1.0

- **Released Thursday May 29th, 2014 @ 9.15am**
- Initial release, ported from [asimov.js](https://github.com/adamrenklint/asimov.js) and refactored
