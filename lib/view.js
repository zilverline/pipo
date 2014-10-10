var View = {
  emit: function(data) {
    this.socket.emit("game", data);
  },

  onScore: function(player, newState) {
    this.socket.emit("score", newState);
    this.emit(newState);
  },

  onTransition: function(newStatus, newState) {
    this.socket.emit(newStatus, newState);
    this.emit(newState);
  }
};

module.exports = function(socket) {
  var view = Object.create(View);
  view.socket = socket;
  return view;
};
