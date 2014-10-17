module.exports = function(grunt) {
  grunt.initConfig({
    now: Date.now(),
    browserify: {
      dev: {
        files: {
          'build/application.js': ['src/javascripts/main.js'],
        },
        options: {
          transform: ['reactify']
        }
      }
    },
    uglify: {
      js: {
        files: {
          'build/application.min.js': 'build/application.js'
        }
      }
    },
    cssmin: {
      dist: {
        files: {
          'build/application.min.css': 'build/application.css'
        }
      }
    },
    sass: {
      options: {
        compass: true,
        require: 'sass-globbing',
        style: 'expanded',
        lineNumbers: true,
        trace: true
      },
      dist: {
        files: {
          'build/application.css': 'src/stylesheets/application.sass'
        }
      }
    },
    watch: {
      options: {
        atBegin: true
      },
      dev: {
        files: ['src/**/*', 'Gruntfile.js'],
        tasks: ['default']
      },
      test: {
        files: ['src/**/*.js', 'lib/**/*.js', 'test/**/*.js'],
        tasks: ['test']
      }
    },
    clean: {
      dist: ['dist/*'],
      build: ['build/*']
    },
    'string-replace': {
      dev: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.html'],
          dest: 'build'
        }],
        options: {
          replacements: [{
            pattern: '@@@JS@@@',
            replacement: 'application.js'
          },
          {
            pattern: '@@@CSS@@@',
            replacement: 'application.css'
          },
          {
            pattern: '@@@SOUNDS@@@',
            replacement: 'sounds'
          }]
        }
      },
      dist: {
        files: {
          'dist/index.html': 'src/index.html'
        },
        options: {
          replacements: [{
            pattern: '@@@JS@@@',
            replacement: 'application-<%= now %>.min.js'
          },
          {
            pattern: '@@@CSS@@@',
            replacement: 'application-<%= now %>.min.css'
          },
          {
            pattern: '@@@SOUNDS@@@',
            replacement: 'sounds-<%= now %>'
          }]
        }
      }
    },
    copy: {
      dev: {
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: ['**/*'],
          dest: 'build/images/'
        }, {
          expand: true,
          cwd: 'src/fonts/',
          src: ['**/*'],
          dest: 'build/fonts/'
        }],
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: ['**/*'],
          dest: 'dist/images/'
        }, {
          expand: true,
          cwd: 'src/fonts/',
          src: ['**/*'],
          dest: 'dist/fonts/'
        }, {
          'dist/application-<%= now %>.min.js': 'build/application.min.js',
          'dist/application-<%= now %>.min.css': 'build/application.min.css',
          'dist/sounds-<%= now %>.mp3': 'build/sounds.mp3',
          'dist/sounds-<%= now %>.oga': 'build/sounds.oga',
          'dist/sounds-<%= now %>.m4a': 'build/sounds.m4a'
        }]
      }
    },
    mochaTest: {
      test: {
        options: {
          reporter: 'dot',
          colors: false
        },
        src: ['test/**/*.js']
      }
    },
    mocha_istanbul: {
      coverage: {
        src: 'test',
        options: {
          mask: '*_test.js',
          noColors: true
        }
      }
    },
    audiosprite: {
      all : {
        cwd: "build/",
        output: "sounds",
        files: "../src/sounds/*.mp3",
        export: "m4a,ogg,mp3",
        log: "warning"
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-string-replace');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-mocha-istanbul');
  grunt.loadNpmTasks('grunt-audiosprite');

  grunt.registerTask('test', 'mochaTest');
  grunt.registerTask('default', ['sass', 'audiosprite', 'browserify:dev', 'string-replace:dev', 'copy:dev']);
  grunt.registerTask('prod', ['default', 'test', 'clean:dist', 'string-replace:dist', 'cssmin', 'uglify', 'copy:dist']);

  grunt.registerTask('refresh-sounds', function() {
    var shell = require("child_process").exec;
    var tts = function(query, filename) {
      if (!filename) {
        filename = query;
      }

      shell("curl -A \"Mozilla/5.0 (Macintosh; Intel Mac OS X 10_9_4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.124 Safari/537.36\" \"http://translate.google.com/translate_tts?tl=en_US&q=" + encodeURIComponent(query) + "\" -o ./src/sounds/" + filename + ".mp3");
    }

    for (var i = 0; i <= 40; i++) {
      tts(i);
    }

    tts("Switching service", "switching-service");
    tts("Gamepoint", "gamepoint");
    tts("Game over", "game-over");
    tts("Sound enabled", "sound-enabled");
  });
};
