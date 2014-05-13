var Base = require('asimov').Base;

module.exports = Base.extend({

  'start': function () {

    //
    console.log('start', process.env.MUTE, process.pid)
  }
});
