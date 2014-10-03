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
      </div>
    );
  },

  renderServiceText: function() {
    if (this.props.game.status === "service") {
      return "Play for the service!";
    } else {
      return "Serving";
    }
  }
});
