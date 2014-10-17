var expect = require("chai").expect;
var sinon = require('sinon');
process.env.NODE_ENV = 'test';
var ScoreButton = require("./../lib/score_button");

describe("ScoreButton", function() {
  var hw_button = {
    watch: function(callback) {
             this._callback = callback;
           },
    unexport: function() { },
    pressButton: function() {
      this._callback();
    }
  }

  var hw_led = {
    write: function(value, callback) {
             this._values.push(value);
             this._value = value;
             if(callback) { callback(); }
           },
    value: function() {
             return this._value;
           },
    values: function() {
              return this._values;
            },
    unexport: function() {
            },
    reset: function() {
             this._values = []
           },
    _values: []
  };

  var score_button = ScoreButton.create({});
  score_button.blinkPeriod = 1;
  var onscore_called = false;
  score_button.bind(function() { onscore_called = true }, hw_button, hw_led);

  beforeEach(function() {
    hw_led.reset();
    onscore_called = false;
  });

  it ("starts with LED off", function() {
    expect(hw_led.value()).to.equal(0);
  });

  it ("can blink", function(done) {
    score_button.blink(1, 'times');
    setTimeout(function() {
      expect(hw_led.values()).to.eql([1,0]);
      done();
    }, 10);
  });

  it ("can blink twice", function(done) {
    score_button.blink(2, 'times');
    setTimeout(function() {
      expect(hw_led.values()).to.eql([1,0,1,0]);
      done();
    }, 10);
  });

  it ("calls onscore function if button pressed", function() {
    hw_button.pressButton();
    expect(onscore_called).to.be.true;
  });

  it ("cancels the current blink if another blink is requested", function(done) {
    score_button.blinkPeriod = 10;
    score_button.blink(20, 'times');

    setTimeout(function() {
      score_button.blink(2, 'times');
    }, 5);

    setTimeout(function() {
      expect(hw_led.values()).to.eql([1,0,1,0,1,0]);
      done();
    }, 50);
  });

  it ("blinks for x seconds", function(done) {
    score_button.blinkPeriod = 150;
    score_button.blink(0.5, 'seconds');

    setTimeout(function() {
      expect(hw_led.values()).to.eql([1,0,1,0,1,0])
      done();
    }, 800);
  });

});
