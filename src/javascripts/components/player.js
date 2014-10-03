/** @jsx React.DOM */

var React = require("react");

module.exports = React.createClass({
  render: function () {
    return (
      <div className={"player " + this.props.key}>
        <h1 onTouchTap={this.handleScore}>{this.props.player.score}</h1>
      </div>
    );
  },

  handleScore: function(e) {
    e.preventDefault();
    e.stopPropagation();

    App.score(this.props.key);
  }
});
