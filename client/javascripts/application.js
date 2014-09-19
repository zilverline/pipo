var React = require("react");
var AppComponent = require("./components/app");

var App = {
  initialize: function() {
    this.mainComponent = React.renderComponent(AppComponent(), document.getElementById("app"));
  }
}

module.exports = App;
