# Changelog

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
