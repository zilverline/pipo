var expect = require("chai").expect;
var sinon = require('sinon');
var Game = require("./../lib/game");

describe("Game", function() {
  var events = { emit: function() {} };
  var game = Game(events);

  afterEach(function() {
    game.reset();
  });

  describe("scoring", function() {
    beforeEach(function() {
      game.service = "left";
      game.status = "playing";
    });

    it ("starts with empty scores", function() {
      expect(game.currentState().players["left"].score).to.equal(0);
      expect(game.currentState().players["right"].score).to.equal(0);
    });

    it ("increases score as player scores", function() {
      game.score("left");
      expect(game.currentState().players["left"].score).to.equal(1);
      expect(game.currentState().players["right"].score).to.equal(0);
    });

    it ("finishes the game when the first player reaches 21", function() {
      game.players["left"].score = 20;
      game.score("left");
      expect(game.currentState().status).to.equal("finished");

      game.reset();
      game.service = "left";
      game.status = "playing";

      game.players["right"].score = 20;
      game.score("right");
      expect(game.currentState().status).to.equal("finished");
    });

    it ("does not finish the game when there is less than 2 point difference", function() {
      game.players["right"].score = 20;
      game.players["left"].score = 20;
      game.score("left");

      expect(game.currentState().players["left"].score).to.equal(21);
      expect(game.currentState().players["right"].score).to.equal(20);
      expect(game.currentState().status).to.equal("playing");

      game.score("right");

      expect(game.currentState().players["left"].score).to.equal(21);
      expect(game.currentState().players["right"].score).to.equal(21);
      expect(game.currentState().status).to.equal("playing");

      game.score("left");
      game.score("left");
      expect(game.currentState().status).to.equal("finished");
    });
  });

  describe("game status", function() {
    var clock;
    beforeEach(function() { clock = sinon.useFakeTimers() });
    afterEach(function() { clock.restore() });

    it ("starts in idle", function() {
      expect(game.currentState().status).to.equal("idle");
    });

    it ("starts game in serving when any button pressed", function() {
      game.status = "idle";
      game.score("left");
      expect(game.currentState().status).to.equal("service");

      game.status = "idle";
      game.score("right");
      expect(game.currentState().status).to.equal("service");
    });

    it ("resets finished game after 60s", function() {
        game.status = "playing";
        game.players["left"].score = 20;
        game.score("left");
        clock.tick(60100);
        expect(game.currentState().status).to.equal("idle");
    });
  });

  describe("serving", function() {
    it ("starts without anyone serving", function() {
      expect(game.currentState().service).to.be.null;
    });

    it ("sets the server when the first person scores, does not increase score", function() {
      game.status = "service";
      game.score("left");
      expect(game.currentState().service).to.equal("left");
      expect(game.currentState().status).to.equal("playing");

      expect(game.currentState().players["left"].score).to.equal(0);
      expect(game.currentState().players["right"].score).to.equal(0);
    });

    it ("switches service to the other player after 5 serves", function() {
      game.status = "playing";
      game.service = "left";
      game.players["left"].score = 4;

      expect(game.currentState().service).to.equal("left");
      game.score("left");
      expect(game.currentState().service).to.equal("right");
    });

    it ("switches service to the other player every turn when it's 20-20", function() {
      game.status = "playing";
      game.service = "left";
      game.players["left"].score = 20;
      game.players["right"].score = 19;

      game.score("right");
      expect(game.currentState().service).to.equal("right");

      game.score("right");
      expect(game.currentState().service).to.equal("left");

      game.score("left");
      expect(game.currentState().service).to.equal("right");
    });
  });
});
