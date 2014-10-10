var View = {
  emit: function(data) {
    this.io.emit("game", data);
  },

  onScore: function(player, newState) {
    this.io.emit("score", newState);
    this.emit(newState);
  },

  onTransition: function(newStatus, newState) {
    this.io.emit(newStatus, newState);
    this.emit(newState);
  }
};

module.exports = function(io) {
  var view = Object.create(View);
  view.io = io;
  return view;
};
