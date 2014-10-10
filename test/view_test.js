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
  var Led = {
    blink: function(times, speed) {
      var event = {};
      event[speed] = times;
      this.blinks.push(event);
    },
    restore: function() {
      this.blinks = [];
    },
    blinks: []
  };
  var leds = {
    'left': Object.create(Led),
    'right': Object.create(Led),
    restore: function() {
      this['left'].restore();
      this['right'].restore();
    }
  };
  var view = View(socket, leds);

  afterEach(function() {
    socket.restore();
    leds.restore();
  });

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

    it ("blinks led", function() {
      view.onScore("left", "left scored");
      expect(leds['left'].blinks).to.contain({'fast': 3});
      expect(leds['right'].blinks).to.be.empty;
    });
  });

  describe("onTransition", function() {
    it ("emits game state", function() {
      var gameState = "service won by right";
      view.onTransition("service", gameState);
      expect(socket.events).to.contain({"game": gameState});
    });
  });
});
