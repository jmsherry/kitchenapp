'use strict';

/**
 * Inject css/js files in index.html
 */

var gulp        = require('gulp');
var bowerFiles  = require('main-bower-files'); //fn that returns the main component files
var headScripts = require('./config/headScripts');
var inject      = require('gulp-inject');
var _           = require('lodash');
var toInject    = require('./config/filesToInject'); //user files
var toExclude   = require('./config/bowerFilesToExclude');

module.exports = function () {
  var sources = gulp.src(toInject, { read: false });
  var bowerBodyScripts = bowerFiles();

  for(var i=0; i<headScripts.length; i+=1){
    bowerBodyScripts = _.pull(bowerBodyScripts, headScripts[i]);
  }

  return gulp.src('client/index.html')
    .pipe(inject(gulp.src(bowerBodyScripts, { read: false }), {
      name: 'bower',
      relative: 'true',
      ignorePath: toExclude
    }))
    .pipe(inject(gulp.src(headScripts, { read: false }), {
      name: 'head',
      relative: 'true'
    }))
    .pipe(inject(sources, { relative: true }))
    .pipe(gulp.dest('client'));
};
