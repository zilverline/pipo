var expect = require("chai").expect;
var sinon = require('sinon');
var Game = require("./../lib/game");

describe("Game", function() {
  var view = {
    emit: function(data) {
      this.gameState = data;
    },
    onScore: function(player, state) {
      this.lastScored = player;
      this.gameState = state;
    },
    onTransition: function(newStatus, state) {
      this.status = newStatus;
      this.gameState = state;
    },
    onSwitchService: function(player) {
      this.service = player;
    }
  };
  var game = Game(view);

  beforeEach(function() {
    game.publish();
  });
  afterEach(function() {
    game.reset();
  });

  describe("scoring", function() {
    beforeEach(function() {
      game.service = "left";
      game.status = "playing";
    });

    it ("starts with empty scores", function() {
      expect(view.gameState.players["left"].score).to.equal(0);
      expect(view.gameState.players["right"].score).to.equal(0);
    });

    it ("increases score as player scores", function() {
      game.round("left");
      expect(view.lastScored).to.equal("left");
      expect(view.gameState.players["left"].score).to.equal(1);
      expect(view.gameState.players["right"].score).to.equal(0);
    });

    it ("finishes the game when the first player reaches 21", function() {
      game.players["left"].score = 20;
      game.round("left");
      expect(view.gameState.status).to.equal("finished");

      game.reset();
      game.service = "left";
      game.status = "playing";

      game.players["right"].score = 20;
      game.round("right");
      expect(view.gameState.status).to.equal("finished");
      expect(view.gameState.winner).to.equal("right");
    });

    it ("does not finish the game when there is less than 2 point difference", function() {
      game.players["right"].score = 20;
      game.players["left"].score = 20;
      game.round("left");

      expect(view.gameState.players["left"].score).to.equal(21);
      expect(view.gameState.players["right"].score).to.equal(20);
      expect(view.gameState.status).to.equal("playing");

      game.round("right");

      expect(view.gameState.players["left"].score).to.equal(21);
      expect(view.gameState.players["right"].score).to.equal(21);
      expect(view.gameState.status).to.equal("playing");

      game.round("left");
      game.round("left");
      expect(view.gameState.status).to.equal("finished");
      expect(view.gameState.winner).to.equal("left");
    });
  });

  describe("game status", function() {
    it ("starts in idle", function() {
      expect(view.gameState.status).to.equal("idle");
    });

    it ("starts game in serving when any button pressed", function() {
      game.status = "idle";
      game.round("left");
      expect(view.gameState.status).to.equal("service");

      game.status = "idle";
      game.round("right");
      expect(view.gameState.status).to.equal("service");
    });
  });

  describe("finished game", function() {
    var clock;
    beforeEach(function() {
      clock = sinon.useFakeTimers();
      game.status = "service"
      game.round("left");
      game.players["left"].score = 20;
      game.round("left");
    });
    afterEach(function() { clock.restore() });

    it ("has a 'rematch' status", function() {
      expect(view.status).to.equal("finished");
    });

    it ("resets game after 60s", function() {
      clock.tick(60100);
      expect(view.gameState.status).to.equal("idle");
    });

    it ("starts a rematch on round", function() {
      game.started = "right";
      game.round();
      clock.tick(60100);
      expect(view.gameState.status).to.equal("playing");
      expect(view.gameState.service).to.equal("left");
    });
  });

  describe("serving", function() {
    it ("starts without anyone serving", function() {
      expect(view.gameState.service).to.be.null;
    });

    it ("sets the server when the first person scores, does not increase score", function() {
      game.status = "service";
      game.round("left");
      expect(view.service).to.equal("left");
      expect(view.gameState.status).to.equal("playing");

      expect(view.gameState.players["left"].score).to.equal(0);
      expect(view.gameState.players["right"].score).to.equal(0);
    });

    it ("switches service to the other player after 5 serves", function() {
      game.status = "playing";
      game.service = "left";
      game.players["left"].score = 4;
      game.publish();

      expect(view.service).to.equal("left");
      game.round("left");
      expect(view.service).to.equal("right");
    });

    it ("switches service to the other player every turn when it's 20-20", function() {
      game.status = "playing";
      game.service = "left";
      game.players["left"].score = 20;
      game.players["right"].score = 19;

      game.round("right");
      expect(view.service).to.equal("right");

      game.round("right");
      expect(view.service).to.equal("left");

      game.round("left");
      expect(view.service).to.equal("right");
    });
  });
});
