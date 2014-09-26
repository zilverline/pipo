var nodeStatic = require("node-static");
var folder = new nodeStatic.Server(process.env.NODE_ENV == "production" ? "./dist" : "./build");
var server = require("http").createServer(function (req, res) {
  console.log(req.method + ": " + req.url);

  req.addListener('end', function () {
    folder.serve(req, res);
  }).resume();
}).listen(3000, function() {
  console.log("Started pipo on port 3000");
});

var io = require("socket.io").listen(server);
var ScoreButton = require("./lib/score_button");
var game = require("./lib/game")(io);
var buttons = {
  left: new ScoreButton(17, "left", game),
  right: new ScoreButton(18, "right", game)
}

io.on("connection", function (socket) {
  game.publish();

  socket.on("score", function(data) {
    buttons[data].press();
  });

  socket.on("new", function() {
    game.reset();
  });
});
