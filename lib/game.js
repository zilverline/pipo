var SERVES_PER_SERVICE = 5;
var POINT_DIFFERENCE = 2;
var GAME_OVER_TIMEOUT = 60000;

var game = {
  start: function(view) {
    this.view = view;
    return this;
  },

  round: function(winnerOfRound) {
    switch (this.status) {
      case "idle":
        this.become("service");
        break;
      case "service":
        this.become("playing", function() { this.started = this.service = winnerOfRound });
        break;
      case "finished":
        this.become("playing", this.rematch);
        break;
      default:
        this.processScore(winnerOfRound);
        var winner = this.checkForWin();
        if (winner) {
          this.become("finished", function() { this.finish(winner) });
        } else {
          this.checkForServiceSwitch();
        }
    }
  },

  become: function(status, fn) {
    if (fn) fn.apply(this);
    this.status = status;
    this.view.onTransition(status, this.currentState());
  },

  stay: function(fn) {
    fn.apply(this);
  },

  processScore: function(player) {
    this.players[player].score += 1;
    this.view.onScore(player, this.currentState());
  },

  reset: function() {
    this.loadNewGame();
    this.status = "idle";
    this.service = this.started = null;
    this.publish();
  },

  rematch: function() {
    this.loadNewGame();
    this.started = this.service = this.nextService(this.started);
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

  winner: null,

  totalPoints: function() {
    return this.players["left"].score + this.players["right"].score;
  },

  switchService: function() {
    this.service = this.nextService(this.service);
    this.view.onSwitchService(this.service);
    this.publish();
  },

  nextService: function(id) {
    if (id === "left") {
      return "right";
    } else {
      return "left";
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
        return "left";
      }
    }

    if (this.players["right"].score >= 21) {
      if (this.players["right"].score - this.players["left"].score >= POINT_DIFFERENCE) {
        return "right";
      }
    }

    return undefined;
  },

  finish: function(id) {
    this.winner = id;
    if (! this.gameOver) {
      this.gameOver = setTimeout(this.reset.bind(this), GAME_OVER_TIMEOUT);
      this.gameOverTimeout = GAME_OVER_TIMEOUT;
    }
  },

  loadNewGame: function() {
    this.players["left"].score = 0;
    this.players["right"].score = 0;
    this.winner = null;
    if (this.gameOver) {
      clearTimeout(this.gameOver);
      this.gameOver = null;
      this.gameOverTimeout = null;
    }
  },

  publish: function() {
    this.view.emit(this.currentState());
  },

  currentState: function() {
    return {
      service: this.service,
      players: this.players,
      status: this.status,
      gameOverTimeout: this.gameOverTimeout,
      winner: this.winner
    };
  }
}

module.exports = function(view) {
  return game.start(view);
};
