var sound = require("howler");
var Howler = sound.Howler;
var Howl = sound.Howl;

var convertSprite = function(rawSprite) {
  audiosprite = {}
  audiosprite.urls = [soundBaseName + ".m4a", soundBaseName + ".oga", soundBaseName + ".mp3"];
  audiosprite.sprite = {}

  for (var sn in rawSprite.spritemap) {
    var spriteInfo = rawSprite.spritemap[sn]
    audiosprite.sprite[sn] = [spriteInfo.start * 1000, (spriteInfo.end - spriteInfo.start) * 1000];
    if (spriteInfo.loop) {
      audiosprite.sprite[sn].push(true);
    }
  }
  return audiosprite;
}

var Sound = function() {
  this._paused = true;
  this._playlist = [];

  this.howl = new Howl(convertSprite(require("../../build/sounds.json")));
  this.howl.on("end", function() {
    if (this._playlist.length > 0) {
      this.howl.play(this.next());
    } else {
      this._paused = true;
    }
  }.bind(this));
}

Sound.prototype.next = function() {
  return this._playlist.shift();
}

Sound.prototype.add = function() {
  for (var i = 0; i < arguments.length; i++) {
    this._playlist.push(arguments[i]);
  }

  return this;
}

Sound.prototype.play = function() {
  if (this._paused) {
    this._paused = false;
    this.howl.play(this.next());
  }

  return this;
}

Sound.prototype.unload = function() {
  this.howl.unload();
}

module.exports = Sound
