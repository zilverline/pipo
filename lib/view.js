var View = {
  emit: function(data) {
    this.socket.emit("game", data);
  },

  onScore: function(player, newState) {
    this.leds[player].blink(3, 'times');
    this.socket.emit("score", newState);
    this.emit(newState);
  },

  onTransition: function(newStatus, newState) {
    this.emit(newState);
    if (newStatus === "finished") {
      var timeout = newState.gameOverTimeout / 1000;
      this.leds['left'].blink(timeout, 'seconds');
      this.leds['right'].blink(timeout, 'seconds');
    }
  },

  onSwitchService: function(player) {
    this.socket.emit("service", player);
  }
};

module.exports = function(socket, leds) {
  var view = Object.create(View);
  view.socket = socket;
  view.leds = leds;
  return view;
};
