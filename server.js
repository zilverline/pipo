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

var io = require('socket.io').listen(server);

var game = {
  players: [{
    name: "Daniel",
    score: 0
  }, {
    name: "Bart",
    score: 1
  }],
  service: "Daniel",
}

io.on("connection", function (socket) {
  socket.emit("game", game);
});
