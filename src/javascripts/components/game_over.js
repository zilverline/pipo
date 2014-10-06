/** @jsx React.DOM */

var React = require("react");

module.exports = React.createClass({
  getInitialState: function() {
    return {
      gameOverTimeout: this.props.game.gameOverTimeout / 1000
    }
  },

  componentDidMount: function() {
    this.interval = setInterval(this.timoutTick, 1000);
  },

  componentWillUnmount: function() {
    clearInterval(this.interval);
  },

  render: function () {
    return (
      <div className="game-over">{"Press any button to start a rematch! " + this.renderTimeout()}</div>
    );
  },

  renderTimeout: function() {
    return "(" + this.state.gameOverTimeout + ")";
  },

  timoutTick: function() {
    this.setState({gameOverTimeout: this.state.gameOverTimeout - 1});
  }
});
