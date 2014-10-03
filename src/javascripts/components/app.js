/** @jsx React.DOM */

var React = require("react");
var StartGameComponent = require("./start_game");
var ScoreBoard = require("./score_board");

module.exports = React.createClass({
  render: function () {
    if (this.props.game.status === "idle") {
      return <StartGameComponent />
    } else {
      return <ScoreBoard game={this.props.game} />
    }
  }
});
