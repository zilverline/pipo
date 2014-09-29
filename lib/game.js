var SERVES_PER_SERVICE = 5;
var POINT_DIFFERENCE = 2;

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

  service: null,

  status: "service",

  totalPoints: function() {
    return this.players["left"].score + this.players["right"].score;
  },

  switchService: function() {
    if (this.service == "left") {
      this.service = "right";
    } else {
      this.service = "left";
    }
  },

  checkForServiceSwitch: function() {
    if (this.players["left"].score >= 20 && this.players["right"].score >= 20) {
      this.switchService();
    } else if (this.totalPoints() % SERVES_PER_SERVICE === 0) {
      this.switchService();
    }
  },

  checkForWin: function() {
    if (this.players["left"].score >= 21) {
      if (this.players["left"].score - this.players["right"].score >= POINT_DIFFERENCE) {
        this.status = "finished";
      }
    }

    if (this.players["right"].score >= 21) {
      if (this.players["right"].score - this.players["left"].score >= POINT_DIFFERENCE) {
        this.status = "finished";
      }
    }
  },

  score: function(id) {
    if (this.service) {
      this.players[id].score += 1;
      this.checkForServiceSwitch();
      this.checkForWin();
    } else {
      this.service = id;
      this.status = "playing";
    }
    this.publish();
  },

  reset: function() {
    this.players["left"].score = 0;
    this.players["right"].score = 0;
    this.service = null;
    this.status = "service";
    this.publish();
  },

  publish: function() {
    this.io.emit("game", this.currentState());
  },

  currentState: function() {
    return {
      service: this.service,
      players: this.players,
      status: this.status
    };
  }
}

module.exports = function(io) {
  return game.start(io);
};
