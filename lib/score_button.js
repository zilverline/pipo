if (process.env.NODE_ENV === 'production') {
  var gpio = require('onoff');
}

var Blinker = {
  create: function(led, times, period) {
    var blinker = Object.create(Blinker);
    blinker.led = led;
    blinker.times = times;
    blinker.period = period;
    blinker.led_status = 0;
    return blinker;
  },

  cancel: function() {
    clearInterval(this._blinker);
    if (this.led_status == 1) {
      this._set_led_status(0);
    }
  },

  run: function() {
    this._queueBlinks();
  },

  _blink: function() {
    new_status = this.led_status === 0 ? 1 : 0;
    this._set_led_status(new_status);
  },

  _set_led_status: function(status) {
    this.led_status = status;
    this.led.write(status);
  },

  _queueBlinks: function() {
    var self = this;

    setTimeout(function() {
      self.cancel();
    }, (this.times * 2) * this.period);

    this._set_led_status(1);

    this._blinker = setInterval(function() {
      self._blink();
    }, this.period);
  }
};

var GpioScoreButton = {
  blinkPeriod: 400,

  create: function(pins) {
    var self = Object.create(this);
    self.pins = pins;
    return self;
  },

  bind: function(onscore, button, led) {
    this.button = button || new gpio.Gpio(this.pins['button'], 'in', 'rising', {'debounceTimeout': 2000});
    this.led = led || new gpio.Gpio(this.pins['led'], 'out');

    this.button.watch(function(err, signal) {
      if (err) onscore(err);
      onscore();
    });
    this.led.write(0, function() {});
    this._blinker = Blinker.create(this.led, 0, this.period);
  },

  unbind: function() {
    this.button.unexport();
    this.led.write(0, this.led.unexport);
  },

  blink: function(n, unit) {
    var period = this.blinkPeriod;
    var times = this._toBlinkTimes(n, unit, period);
    this._blinker.cancel();
    this._blinker = Blinker.create(this.led, times, period);
    this._blinker.run();
  },

  _toBlinkTimes: function(n, unit, period) {
    switch (unit) {
      case 'times':
        return n;
      case 'seconds':
        return (n * 1000) / period;
      default:
        throw "Unknown blink unit: " + unit;
    }
  }
};

var OfflineScoreButton = {
  create: function(pins) { return this },
  bind: function() {},
  unbind: function() {},
  blink: function(n, unit) {
    console.log("Blinking " + n + " " + unit);
  }
};

function shouldLoadGpoiScoreButton() {
  return process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'test'
}
var ScoreButton = shouldLoadGpoiScoreButton() ? GpioScoreButton : OfflineScoreButton;
module.exports = ScoreButton;
