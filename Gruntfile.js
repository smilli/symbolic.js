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
        globals: {
          describe: false,
          it: false,
          expect: false
        },
      },
      all: ['src/*.js', 'test/*.js']
    },
    jasmine: {
      src: 'src/*.js',
      options: {
        specs: 'test/*Spec.js',
      }
    },
    concat: {
      options: {
        seperator: ';',
      },
      dist: {
        src: 'src/*.js',
        dest: 'dist/symbolic.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.registerTask('test', ['jshint', 'jasmine']);
  grunt.registerTask('build', ['jshint', 'jasmine', 'concat']);
};
