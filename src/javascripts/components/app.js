/** @jsx React.DOM */

var React = require("react/addons");
var StartGameComponent = require("./start_game");
var ScoreBoard = require("./score_board");
var ReactCSSTransitionGroup = React.addons.CSSTransitionGroup;

module.exports = React.createClass({
  render: function () {
    return (
      <ReactCSSTransitionGroup transitionName="page" transitionEnter={false} transitionLeave={false}>
        {this.renderGameState()}
      </ReactCSSTransitionGroup>
    );
  },

  renderGameState: function() {
    if (this.props.game.status === "idle") {
      return <StartGameComponent key="start" />
    } else {
      return <ScoreBoard key="board" game={this.props.game} />
    }
  }
});
