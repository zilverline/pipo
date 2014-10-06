/** @jsx React.DOM */

var React = require("react");
var PlayerComponent = require("./player");
var GameOverComponent = require("./game_over");

module.exports = React.createClass({
  render: function () {
    return (
      <div className="mod-board">
        {this.renderIndicator()}

        <PlayerComponent key={"left"} player={this.props.game.players["left"]} />
        <PlayerComponent key={"right"} player={this.props.game.players["right"]} />

        <div className="controls">
          <a href="#" onTouchTap={this.handleReset}>
            <i className="fa fa-sign-out" />
          </a>
        </div>

        {this.renderGameOver()}
      </div>
    );
  },

  renderGameOver: function() {
    if (this.props.game.status === "finished") {
      return <GameOverComponent game={this.props.game} />;
    }
  },

  renderIndicator: function() {
    var className;
    var text;

    switch(this.props.game.status) {
      case "finished":
        className = "winner " + this.props.game.winner;
        text = "Winner"
        break;
      case "service":
        className = "serving";
        text = "Play for the service!";
        break;
      case "playing":
        className = "serving " + this.props.game.service;
        text = "serving";
        break;
    }

    return (
      <div className={className}>{text}</div>
    );
  },

  handleReset: function(e) {
    e.preventDefault();
    e.stopPropagation();
    App.resetGame();
  }
});
