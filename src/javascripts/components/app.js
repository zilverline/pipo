/** @jsx React.DOM */

var React = require("react");
var ScoreComponent = require("./score");
var NewGameComponent = require("./new_game");

module.exports = React.createClass({
  render: function () {
    return (
      <div className="mod-board">
        <NewGameComponent />

        <ScoreComponent pos="left" player={this.props.game.players.left} />
        <ScoreComponent pos="right" player={this.props.game.players.right} />
      </div>
    );
  }
});
