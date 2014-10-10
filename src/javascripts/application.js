var $ = require("jquery");
var React = require("react");
var connectSocket = require("socket.io-client");
var AppComponent = require("./components/app");
var Sound = require("./sound");

var App = {
  initialize: function() {
    this.mute = true;

    this.socket = connectSocket(document.location.origin);

    this.socket.on('game', this.renderGame.bind(this));
  },

  renderGame: function(game) {
    if (!this.mainComponent) {
      this.mainComponent = React.renderComponent(AppComponent({game: game}), document.getElementById("app"));
    } else {
      this.mainComponent.setProps({game: game});
    }
  },

  toggleSound: function() {
    this.mute = !this.mute;
    if (!this.mute) {
      this.sound = new Sound();

      this.socket.on('score', this.playScoreSound.bind(this));
      this.socket.on('gamepoint', this.playGamepointSound.bind(this));
      this.socket.on('winner', this.playWinnerSound.bind(this));
      this.socket.on('service', this.playServiceSound.bind(this));
    } else {
      this.socket.removeAllListeners('score');
      this.socket.removeAllListeners('gamepoint');
      this.socket.removeAllListeners('winner');
      this.socket.removeAllListeners('service');
    }

    this.mainComponent.forceUpdate();
  },

  playScoreSound: function(game) {
    this.sound.add(game.players[game.service].score + "");
    this.sound.add(game.players[game.service === "left" ? "right" : "left"].score + "");
    this.sound.play();
  },

  playGamepointSound: function() {
    this.sound.add("game-point").play();
  },

  playWinnerSound: function() {
    this.sound.add("game-over").play();
  },

  playServiceSound: function() {
    this.sound.add("switching-service").play();
  },

  startGame: function() {
    this.socket.emit("start");
  },

  score: function(id) {
    this.socket.emit("score", id);
  },

  resetGame: function() {
    this.socket.emit("reset");
  }
}

module.exports = App;
