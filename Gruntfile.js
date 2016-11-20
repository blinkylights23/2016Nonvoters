'use strict';
// Created using generator-grunt-simplesite 0.0.0 on 2016-11-15

var poststylus = require('poststylus');
var browserSync = require('browser-sync');
var axis = require('axis');
var rupture = require('rupture');

var babel = require('rollup-plugin-babel');
var uglify = require('rollup-plugin-uglify');
var nodeResolve = require('rollup-plugin-node-resolve');
var commonjs = require('rollup-plugin-commonjs');


var postcss = function () {
  return require('poststylus')(['autoprefixer', 'lost']);
};

function setEnv() {
  if (process.env.NODE_ENV) {
    return process.env.NODE_ENV;
  } else {
    return 'dev';
  }
}

module.exports = function (grunt) {

  require('time-grunt')(grunt);
  require('load-grunt-tasks')(grunt);
  // grunt.task.loadTasks('./grunt');

  grunt.initConfig({
    destinations: {
      app: 'app',
      build: 'build'
    },

    env: setEnv(),

    watch: {
      options: {
        spawn: true
      },
      stylus: {
        files: ['<%= destinations.app %>/styl/**/*', '<%= destinations.app %>/css/**/*'],
        tasks: ['stylus:build', 'copy:css', 'bs-inject-css']
      },
      assets: {
        files: ['<%= destinations.app %>/assets/**/*'],
        tasks: ['copy:build', 'bs-reload']
      },
      rollup: {
        files: ['<%= destinations.app %>/js/**/*'],
        tasks: ['clean:rollup', 'rollup:build', 'bs-inject-js']
      },
      pug: {
        files: ['<%= destinations.app %>/pug/**/*.pug'],
        tasks: ['pug:build', 'bs-reload']
      }
    },

    pug: {
      build: {
        options: {
          data: {
            debug: true
          }
        },
        files: [
          {
            src: '<%= destinations.app %>/pug/index.pug',
            dest: '<%= destinations.build %>/index.html'
          }
        ]
      }
    },

    clean: {
      build: ['<%= destinations.build %>/**/*'],
      rollup: [
        '<%= destinations.build %>/js/*.js',
        '<%= destinations.build %>/js/*.map'
      ]
    },

    copy: {
      build: {
        files: [
          {
            expand: true,
            cwd: '<%= destinations.app %>/assets/',
            src: '**/*',
            dest: '<%= destinations.build %>/assets/'
          },
          {
            expand: true,
            cwd: '<%= destinations.app %>/data/',
            src: '**/*',
            dest: '<%= destinations.build %>/data/'
          }
        ]
      },
      css: {
        files: [
          {
            expand: true,
            cwd: '<%= destinations.app %>/css/',
            src: '**/*',
            dest: '<%= destinations.build %>/css/'
          }
        ]
      }
    },

    stylus: {
      build: {
        options: {
          use: [postcss, axis, rupture]
        },
        files: {
          '<%= destinations.build %>/css/style.css': [
            '<%= destinations.app %>/styl/main.styl'
          ]
        }
      }
    },

    rollup: {
      build: {
        options: {
          format: 'iife',
          exports: 'none',
          plugins: [
            babel({
              exclude: 'node_modules/**',
              presets: 'es2015-rollup'
            }),
            uglify(),
            nodeResolve({ jsnext: true, main: true }),
            commonjs({
              include: 'node_modules/**',
              exclude: [ 'node_modules/foo/**', 'node_modules/bar/**' ],
              extensions: [ '.js' ],
              ignoreGlobal: false,
              sourceMap: false
            })
          ]
        },
        files: {
          '<%= destinations.build %>/js/bundle.js': ['<%= destinations.app %>/js/app.js'],
        }
      }
    },

    aws_s3: {
      options: {
        // accessKeyId: '',
        // secretAccessKey: '',
        awsProfile: 'paulsmith',
        region: 'us-east-1',
        uploadConcurrency: 5,
        downloadConcurrency: 5
      },
      production: {
        options: {
          bucket: 'novotes.paulsmith.io',
          differential: true,
          gzipRename: 'ext'
        },
        files: [
          {expand: true, cwd: 'build/', src: ['**'], dest: '/', params: {CacheControl: '300'}}
        ]
      },
    }

  });

  grunt.registerTask('bs-init', function () {
    var done = this.async();
    browserSync({
      open: 'ui',
      // logLevel: 'debug',
      timestamps: false,
      server: {
        baseDir: 'build'
      }
    }, function (err, bs) {
      done();
    });
  });

  grunt.registerTask('bs-reload', function () {
    browserSync.reload();
  });

  grunt.registerTask('bs-inject-js', function () {
    browserSync.reload([
      'js/*.js'
    ]);
  });

  grunt.registerTask('bs-inject-css', function () {
    browserSync.reload([
      'css/*.css'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.task.run([
      'build:build',
      'bs-init',
      'watch'
    ]);
  });

  grunt.registerTask('build', function (target) {
    grunt.task.run([
      'clean:build',
      'clean:rollup',
      'pug',
      'stylus',
      'rollup',
      'copy'
    ]);
  });

  grunt.registerTask('default', [
    'server'
  ]);

  grunt.registerTask('deploy', function(target) {
    grunt.task.run([
      'build',
      'aws_s3:' + target
    ]);
  })

};
