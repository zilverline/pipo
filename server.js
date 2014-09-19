var static = require("node-static");
var folder = new static.Server(process.env.NODE_ENV == "production" ? "./dist" : "./build");
var server = require("http").createServer(function (req, res) {
  console.log(req.method + ": " + req.url);

  req.addListener('end', function () {
    folder.serve(req, res);
  }).resume();
}).listen(3000, function() {
  console.log("Started pipo on port 3000");
});

var io = require("socket.io").listen(server);

var game = require("./lib/game");

io.on("connection", function (socket) {
  socket.emit("game", game);

  socket.on("score", function(data) {
    game.score(data);
    socket.emit("game", game);
  });
});

if (process.env.NODE_ENV == "production") {
  var Gpio = require("onoff").Gpio;
  var left = new Gpio(17, "in", "rising");
  var right = new Gpio(18, "in", "rising");

  left.watch(function(err, signal) {
    if (err) return;
    game.score("left");
    io.emit("game", game);
  });

  right.watch(function(err, signal) {
    if (err) return;
    game.score("right");
    io.emit("game", game);
  });
}
