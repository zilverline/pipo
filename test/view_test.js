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
    blink: function(n, unit) {
      var event = {};
      event[unit] = n;
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
      expect(leds['left'].blinks).to.contain({'times': 3});
      expect(leds['right'].blinks).to.be.empty;
    });
  });

  describe("onTransition", function() {
    it ("emits game state", function() {
      var gameState = "service won by right";
      view.onTransition("service", gameState);
      expect(socket.events).to.contain({"game": gameState});
      expect(leds['left'].blinks).to.be.empty;
      expect(leds['right'].blinks).to.be.empty;
    });

    it ("blinks both leds on finish", function() {
      view.onTransition("finished", { gameOverTimeout: 60000 });
      expect(leds['left'].blinks).to.contain({'seconds': 60});
      expect(leds['right'].blinks).to.contain({'seconds': 60});
    });
  });

  describe("onSwitchService", function() {
    it ("emits service event", function() {
    });
  });

  describe("onSwitchService", function() {
    it ("emits service event", function() {
      view.onSwitchService("left");
      expect(socket.events).to.contain({"service": "left"});
    });
  });
});
