var game = {
  start: function(io) {
    this.io = io;
    return this;
  },
  players: {
    "left": {
      name: "Daniel",
      score: 0
    },
    "right": {
      name: "Bart",
      score: 0
    }
  },
  service: "s0meone",
  score: function(id) {
    this.players[id].score += 1;
    this.publish();
  },
  reset: function() {
    this.players["left"].score = 0;
    this.players["right"].score = 0;
    this.publish();
  },
  publish: function() {
    this.io.emit("game", this.currentState());
  },
  currentState: function() {
    return {
      service: this.service,
      players: this.players
    };
  }
}

module.exports = function(io) {
  return game.start(io);
};
