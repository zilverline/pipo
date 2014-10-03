var injectTapEventPlugin = require("react-tap-event-plugin");
injectTapEventPlugin();

window.App = require("./application");
window.App.initialize();
