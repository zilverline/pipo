var expect = require("chai").expect;
var View = require("./../lib/view");

describe("View", function() {
  var socket = {
    emit: function(name, data) {
      var event = {};
      event[name] = data;
      this.events.push(event);
    },
    restore: function() {
      this.events = [];
    },
    events: []
  };
  var view = View(socket);

  afterEach(socket.restore.bind(socket));

  describe("emit", function() {
    it ("emits game state", function() {
      var gameState = "game state";
      view.emit(gameState);
      expect(socket.events).to.contain({"game": gameState});
    });
  });

  describe("onScore", function() {
    it ("emits score", function() {
      var gameState = "left scored";
      view.onScore("left", gameState);
      expect(socket.events).to.contain({"score": gameState});
    });

    it ("emits game state", function() {
      var gameState = "right scored";
      view.onScore("right", gameState);
      expect(socket.events).to.contain({"game": gameState});
    });
  });

  describe("onTransition", function() {
    it ("emits new status", function() {
      var gameState = "service won by left";
      view.onTransition("service", gameState);
      expect(socket.events).to.contain({"service": gameState});
    });

    it ("emits game state", function() {
      var gameState = "service won by right";
      view.onTransition("service", gameState);
      expect(socket.events).to.contain({"game": gameState});
    });
  });
});
