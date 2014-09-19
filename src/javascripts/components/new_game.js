
/** @jsx React.DOM */

var React = require("react");

module.exports = React.createClass({
  render: function() {
    return (
      <div className="new">
        <a href="#" className="btn" onClick={this.handleNew}>Start new game</a>
      </div>
    );
  },

  handleNew: function(e) {
    e.preventDefault();
    e.stopPropagation();
    App.socket.emit("new");
  }
});
