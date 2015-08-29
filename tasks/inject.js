'use strict';

/**
 * Inject css/js files in index.html
 */

var gulp        = require('gulp');
var bowerFiles  = require('main-bower-files'); //fn that returns the main component files
var angularFilesort    = require('gulp-angular-filesort');
var naturalSort = require('gulp-natural-sort');
var headScripts = require('./config/headScripts');
var inject      = require('gulp-inject');
var _           = require('lodash');
var jsToInject    = require('./config/filesToInject').js; //user files
var cssToInject    = require('./config/filesToInject').css;
var toExclude   = require('./config/bowerFilesToExclude');


module.exports = function(){

  var bowerBodyScripts = bowerFiles();

  for(var i=0; i<headScripts.length; i+=1){
    bowerBodyScripts = _.pull(bowerBodyScripts, headScripts[i]);
  }

  return gulp.src('client/index.html')
  .pipe(inject(gulp.src(cssToInject, { read: false }), {
    relative: 'true'
  }))
  .pipe(inject(gulp.src(headScripts, { read: false }), {
    name: 'head',
    relative: 'true'
  }))
  .pipe(inject(gulp.src(bowerBodyScripts, { read: false }), {
    name: 'bower',
    relative: 'true',
    ignorePath: toExclude
  }))
  .pipe(inject(
    gulp.src(jsToInject).pipe(angularFilesort()).pipe(naturalSort()), { relative: true }
  ))
  .pipe(gulp.dest('client'));
};
