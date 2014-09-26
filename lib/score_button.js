function ScoreButton(pin, id, game) {
  this.id = id;
  this.game = game;

  if (process.env.NODE_ENV == "production") {
    var Gpio = require("onoff").Gpio;
    this.gpio = new Gpio(pin, "in", "rising");
    this.gpio.watch(function(err, signal) {
      this.pressed();
    }.bind(this));
  }
}

ScoreButton.prototype.pressed = function() {
  this.game.score(this.id);
}

ScoreButton.prototype.press = function() {
  this.pressed();
}

module.exports = ScoreButton;
