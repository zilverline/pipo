var $ = require("jquery");
var React = require("react");
var connectSocket = require("socket.io-client");
var AppComponent = require("./components/app");

var App = {
  initialize: function() {
    this.socket = connectSocket(document.location.origin);

    this.socket.on('game', function (data) {
      this.renderGame(data);
    }.bind(this));
  },

  renderGame: function(game) {
    if (!this.mainComponent) {
      this.mainComponent = React.renderComponent(AppComponent({game: game}), document.getElementById("app"));
    } else {
      this.mainComponent.setProps({game: game});
    }
  },

  startGame: function() {
    this.socket.emit("start");
  },

  score: function(id) {
    this.socket.emit("score", id);
  }
}

module.exports = App;
