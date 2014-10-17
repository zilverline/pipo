if (process.env.NODE_ENV === 'production') {
  var gpio = require('onoff');
}

var Blinker = {
  create: function(led, times, period) {
    var blinker = Object.create(Blinker);
    blinker.led = led;
    blinker.times = times;
    blinker.period = period;
    return blinker;
  },

  cancel: function(done) {
    if (this._control) {
      clearTimeout(this._control);
      this._control = null;
      this.led.write(0, done);
    }
  },

  run: function(done) {
    this._done = done;
    this._on();
    this._count = 1;
  },

  _on: function() {
    var self = this;
    this.led.write(1, function() {
      self._control = setTimeout(self._off.bind(self), self.period)
    });
  },
  _off: function() {
    var self = this;
    this.led.write(0, function() {
      if (self._count < self.times) {
        self._control = setTimeout(self._on.bind(self), self.period);
        self._count += 1;
      } else {
        self._control = null;
        self._done();
      }
    });
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
  },

  unbind: function() {
    this.button.unexport();
    this.led.write(0, this.led.unexport);
  },

  blink: function(n, unit) {
    var period = this.blinkPeriod;
    var times = this._toBlinkTimes(n, unit, period);
    var startBlinking = this._blink(times, period);
    if (this._blinker) {
      this._blinker.cancel(startBlinking);
    } else {
      startBlinking();
    }
  },

  _blink: function(times, period) {
    var self = this;
    return function() {
      self._blinker = Blinker.create(self.led, times, period);
      self._blinker.run(function() { self._blinker = null; });
    };
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
