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

  status: "idle",

  gameOver: null,

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

  finish: function() {
    this.status = "finished";
    if (! this.gameOver) {
      this.gameOver = setTimeout(this.reset.bind(this), 60000);
    }
  },

  checkForWin: function() {
    if (this.players["left"].score >= 21) {
      if (this.players["left"].score - this.players["right"].score >= POINT_DIFFERENCE) {
        this.finish();
      }
    }

    if (this.players["right"].score >= 21) {
      if (this.players["right"].score - this.players["left"].score >= POINT_DIFFERENCE) {
        this.finish();
      }
    }
  },

  finish: function() {
    this.status = "finished";
    if (! this.gameOver) {
      this.gameOver = setTimeout(this.reset.bind(this), 60000);
    }
  },

  score: function(id) {
    switch (this.status) {
      case "idle":
        this.status = "service";
        break;
      case "service":
        this.status = "playing";
        this.service = id;
        break;
      case "finished":
        this.rematch();
        break;
      default:
        this.players[id].score += 1;
        this.checkForServiceSwitch();
        this.checkForWin();
    }

    this.publish();
  },

  reset: function() {
    this.players["left"].score = 0;
    this.players["right"].score = 0;
    if (this.gameOver) {
      clearTimeout(this.gameOver);
      this.gameOver = null;
    }
    this.service = null;
    this.status = "idle";
    this.publish();
  },

  rematch: function() {
    var winner = this.players["left"].score > this.players["right"].score ? "left" : "right";
    this.players["left"].score = 0;
    this.players["right"].score = 0;
    if (this.gameOver) {
      clearTimeout(this.gameOver);
      this.gameOver = null;
    }
    this.status = "playing";
    this.service = winner;
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
