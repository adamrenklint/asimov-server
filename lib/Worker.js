var Base = require('asimov').Base;
var _super = Base.prototype;
var express = require('express');

module.exports = Base.extend({

  'initialize': function () {

    var self = this;
    _super.initialize.apply(self, arguments);

    self.bindTo(process, 'message', 'onMessage');
    // self.middleware = {};
    // self.middlewarePaths = {};

    self.state = {};
  },

  'onMessage': function (data) {

    var self = this;

    if (data.url) {
      self.state[data.url] = data;
    }
  },

  'start': function () {

    var self = this;
    var app = self.app = express();


    console.log('start', process.env.MUTE, process.pid)
  }
});
