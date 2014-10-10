# PiPo
Ping Pong table upgrade.

## Setup
Make sure you have node, npm and ruby installed.

 * NPM 2.0.2
 * Node v0.10.32
 * Ruby 2.1.2

Install all dependencies:
```
gem install sass-globbing compass
npm install

npm install -g grunt-cli

# for building audiosprites
brew install ffmpeg --with-theora --with-libogg --with-libvorbis
```

## Build & Run
```
grunt      # builds development version in ./build
grunt prod # builds production version in ./dist

# runs in development mode from ./build
node server.js

# runs in production mode from ./dist
# this only works on a raspberry pi because it uses the gpio ports
NODE_ENV=production node server.js
```

## Test
```
grunt test
```
