/** @jsx React.DOM */

var React = require("react");

module.exports = React.createClass({
  render: function () {
    return (
      <div className="comp-controls">
        <a href="#" onTouchTap={this.handleToggleSound}>
          <i className={"fa " + (App.mute ? "fa-volume-off" : "fa-volume-up")} />
        </a>

        <a href="#" onTouchTap={this.handleReset}>
          <i className="fa fa-sign-out" />
        </a>
      </div>
    );
  },

  handleReset: function(e) {
    e.preventDefault();
    e.stopPropagation();
    App.resetGame();
  },

  handleToggleSound: function(e) {
    e.preventDefault();
    e.stopPropagation();
    App.toggleSound();
  }
});
