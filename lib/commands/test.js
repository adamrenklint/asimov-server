var cluster = require('cluster');
if (cluster.isWorker) process.env.MUTE = true;

var asimov = require('asimov');
var bootstrap = require(process.cwd() + '/index');

process.env.ENV = 'test';

var commandPath = asimov.fs.findFirstMatch('node_modules/asimov-test/lib/Command.js', [process.cwd()]);
var Command = commandPath && require(commandPath);

module.exports = function startCommand (next) {
  bootstrap.start(function () {

    if (!Command) return asimov.error('asimov-test is not installed');

    var test = new Command();
    test.run(next);
  });
};
