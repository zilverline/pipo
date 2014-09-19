var game = {
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
  }
}

module.exports = game;
