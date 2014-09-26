if (process.env.NODE_ENV === 'production') {
  var gpio = require('onoff'); 
}

var GpioScoreButton = {
  blinkFrequency: 400,
  blinkTimes: 3,

  create: function(pins) {
    var self = Object.create(this);
    self.pins = pins;
    return self;
  },

  bind: function(onscore) {
    this.button = new gpio.Gpio(this.pins['button'], 'in', 'rising');
    this.led = new gpio.Gpio(this.pins['led'], 'out');

    var self = this;

    this.button.watch(function(err, signal) {
      if (err) onscore(err);
      self._blink();
      onscore();
    });
  },

  unbind: function() {
    this.button.unexport();
    this.led.write(0, this.led.unexport);
  },

  _blink: function() {
    var self = this;
    var count = 1;
    var on = function() { self.led.write(1, function() { setTimeout(off, self.blinkFrequency) }) };
    var off = function() { self.led.write(0, function() { if (count < self.blinkTimes) { setTimeout(on, self.blinkFrequency); count += 1; } }) };
    on();
  }
};

var OfflineScoreButton = {
  create: function(pins) { return this },
  bind: function() {},
  unbind: function() {}
};

var ScoreButton = process.env.NODE_ENV === 'production' ? GpioScoreButton : OfflineScoreButton;
module.exports = ScoreButton;
