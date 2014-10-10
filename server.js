var nodeStatic = require("node-static");
var folder, cache;
if (process.env.NODE_ENV == "production") {
  folder = "./dist";
  cache = 3600 * 24 * 365; // one year
} else {
  folder = "./build";
  cache = false; // disable cache
}

var folderServer = new nodeStatic.Server(folder, { cache: cache });

var server = require("http").createServer(function (req, res) {
  console.log(req.method + ": " + req.url);

  req.addListener('end', function () {
    folderServer.serve(req, res);
  }).resume();
}).listen(3000, function() {
  console.log("Started pipo on port 3000");
});

var io = require("socket.io").listen(server);
var ScoreButton = require("./lib/score_button");
var game = require("./lib/game")(io);
var buttons = {
  left: ScoreButton.create({ button: 17, led: 18 }),
  right: ScoreButton.create({ button: 22, led: 23 })
}

var onscore = function(side) {
  return function(err) {
    if (err) return;
    game.score(side);
  }
};

buttons['left'].bind(onscore('left'));
buttons['right'].bind(onscore('right'));

io.on("connection", function (socket) {
  game.publish();

  socket.on("score", function(data) {
    game.score(data);
  });

  socket.on("start", function() {
    game.score();
  });

  socket.on("reset", function() {
    game.reset();
  });
});

var exit = function() {
  buttons['left'].unbind();
  buttons['right'].unbind();
  process.exit();
};

process.on('SIGINT', exit);
