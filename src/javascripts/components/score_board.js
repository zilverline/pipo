/** @jsx React.DOM */

var React = require("react");
var PlayerComponent = require("./player");

module.exports = React.createClass({
  render: function () {
    return (
      <div className="mod-board">
        <div className={"serving " + this.props.game.service}>{this.renderServiceText()}</div>
        <PlayerComponent key={"left"} player={this.props.game.players["left"]} />
        <PlayerComponent key={"right"} player={this.props.game.players["right"]} />
        <div className="controls">
          <a href="#" onTouchTap={this.handleReset}>
            <i className="fa fa-sign-out" />
          </a>
        </div>
      </div>
    );
  },

  renderServiceText: function() {
    if (this.props.game.status === "service") {
      return "Play for the service!";
    } else {
      return "Serving";
    }
  },

  handleReset: function(e) {
    e.preventDefault();
    e.stopPropagation();
    App.resetGame();
  }
});
