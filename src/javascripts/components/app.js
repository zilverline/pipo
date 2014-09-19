/** @jsx React.DOM */

var React = require("react");
var ScoreComponent = require("./score");

module.exports = React.createClass({
  render: function () {
    return (
      <div className="mod-board">
        <ScoreComponent pos="left" player={this.props.game.players.left} />
        <ScoreComponent pos="right" player={this.props.game.players.right} />
      </div>
    );
  }
});
