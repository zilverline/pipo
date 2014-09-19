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
      files: ['src/**/*', 'Gruntfile.js'],
      tasks: ['default'],
      options: {
        atBegin: true
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
        }],
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/images/',
          src: ['**/*'],
          dest: 'dist/images/'
        }, {
          'dist/application-<%= now %>.min.js': 'build/application.min.js',
          'dist/application-<%= now %>.min.css': 'build/application.min.css'
        }]
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

  grunt.registerTask('default', ['sass', 'browserify:dev', 'string-replace:dev', 'copy:dev']);
  grunt.registerTask('prod', ['default', 'clean:dist', 'string-replace:dist', 'cssmin', 'uglify', 'copy:dist']);
};
