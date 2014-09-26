var expect = require('chai').expect;
var Game = require('./../lib/game');

describe('Game', function() {
  it ('should start with empty scores', function() {
    var events = {};
    var game = Game(events);
    expect(game.currentState().players['left'].score).to.equal(0);
    expect(game.currentState().players['right'].score).to.equal(0);
  });

  it ('should increase score as player scores', function() {
    var events = { emit: function() {} };
    var game = Game(events);
    game.score('left');
    expect(game.currentState().players['left'].score).to.equal(1);
    expect(game.currentState().players['right'].score).to.equal(0);
  });
});
