/** @jsx React.DOM */

var React = require("react");

module.exports = React.createClass({
  render: function () {
    return (
      <div className="mod-start" onTouchTap={this.handleStartGame}>
        <h1>Press any button to start a new game!</h1>
      </div>
    );
  },

  handleStartGame: function() {
    App.startGame();
  }
});
