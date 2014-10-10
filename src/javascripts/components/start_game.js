/** @jsx React.DOM */

var React = require("react");
var ControlsComponent = require("./controls");

module.exports = React.createClass({
  render: function () {
    return (
      <div className="mod-start" onTouchTap={this.handleStartGame}>
        <h1>Press any button to start a new game!</h1>
        <ControlsComponent />
      </div>
    );
  },

  handleStartGame: function() {
    App.startGame();
  }
});
