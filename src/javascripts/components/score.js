/** @jsx React.DOM */

var React = require("react");

module.exports = React.createClass({
  render: function() {
    return (
      <div className="score">
        {this.props.player.score}
        <br />
        <a href="#" className="btn" onClick={this.handleScore}>
          Score
        </a>
      </div>
    );
  },

  handleScore: function(e) {
    e.preventDefault();
    e.stopPropagation();
    App.socket.emit("score", this.props.pos);
  }
});
