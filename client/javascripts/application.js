var React = require("react");
var connectSocket = require("socket.io-client");
var AppComponent = require("./components/app");

var App = {
  initialize: function() {
    this.socket = connectSocket(document.location.origin);
    this.mainComponent = React.renderComponent(AppComponent(), document.getElementById("app"));
    this.socket.on('news', function (data) {
      console.log(data);
      this.socket.emit('my other event', { my: 'data' });
    }.bind(this));
  }
}

module.exports = App;
