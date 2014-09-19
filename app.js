var express = require('express');
var debug = require('debug')('pipo');
var path = require('path');
var logger = require('morgan');
var browserify = require('browserify-middleware');

var app = express();

app.get('/javascripts/main.js', browserify('./client/javascripts/main.js', { transform: ["reactify"] }));

app.set('port', process.env.PORT || 3000);
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(require('node-compass')({
  sass: "../client/stylesheets",
  logging: true
}));

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

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

app.use(function(err, req, res, next) {
  res.status(err.status || 500).json({
    message: err.message,
    error: err
  });
});

var server = app.listen(app.get('port'), function() {
  debug('Express server listening on port ' + server.address().port);
});

var io = require('socket.io').listen(server);

io.on('connection', function (socket) {
  socket.emit('game', game);
});
