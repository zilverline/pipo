/** @jsx React.DOM */

var React = require("react");
var ScoreComponent = require("./score");

module.exports = React.createClass({
  render: function () {
    return (
      <div className="mod-board">
        {this.props.game.players.map(this.renderScore)}
      </div>
    );
  },

  renderScore: function(player) {
    return (
      <ScoreComponent key={player.name} score={player.score} />
    );
  }
});
