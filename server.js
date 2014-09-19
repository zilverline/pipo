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

var game = require("./lib/game")(io);

io.on("connection", function (socket) {
  game.publish();

  socket.on("score", function(data) {
    game.score(data);
  });

  socket.on("new", function() {
    game.reset();
  });
});

if (process.env.NODE_ENV == "production") {
  var Gpio = require("onoff").Gpio;
  var left = new Gpio(17, "in", "rising");
  var right = new Gpio(18, "in", "rising");
  var speaker = new Gpio(22, "out");
  var sleep = require("sleep");

  var yeah = function(pitch) {
    var duration = 0.15;
    var period = 1.0 / pitch;
    var delay = period / 2;
    var cycles = duration * pitch | 0;

    for (var i = 0; i < cycles; i++) {
      speaker.writeSync(1);
      sleep(delay * 1000000);
      speaker.writeSync(0);
      sleep(delay * 1000000);
    }
  }

  left.watch(function(err, signal) {
    if (err) return;
    game.score("left");
    yeah(200);
  });

  right.watch(function(err, signal) {
    if (err) return;
    game.score("right");
    yeah(400);
  });
}
