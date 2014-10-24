module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    jshint: {
      options: {
        camelcase: true,
        curly: true,
        eqeqeq: true,
        freeze: true,
        latedef: true,
        nonbsp: true,
        quotmark: 'single',
        evil: true,
        globals: {
          describe: false,
          it: false,
          expect: false
        },
      },
      all: ['src/*.js', 'test/*.js']
    },
    jasmine: {
      src: 'dist/symbolic.js',
      options: {
        specs: 'test/*Spec.js',
      }
    },
    concat: {
      options: {
        seperator: ';',
      },
      dist: {
        src: ['src/sy.js', 'src/*.js'],
        dest: 'dist/symbolic.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('test', ['jshint', 'concat', 'jasmine']);
};
