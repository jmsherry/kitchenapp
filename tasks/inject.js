'use strict';

/**
 * Inject css/js files in index.html
 */

var gulp        = require('gulp');
var angularFilesort    = require('gulp-angular-filesort');
var naturalSort = require('gulp-natural-sort');
var headScripts = require('./config/headScripts');
var inject      = require('gulp-inject');
var scripts     = require('./getInjectableFilesList')();

var cssToInject = scripts.userStyles;
var jsToInject = scripts.userScripts;
var headScripts = scripts.headScripts;
var bowerBodyScripts = scripts.bowerBodyScripts;


module.exports = function(){

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
    relative: 'true'
  }))
  .pipe(inject(
    gulp.src(jsToInject).pipe(angularFilesort()).pipe(naturalSort()), { relative: true }
  ))
  .pipe(gulp.dest('client'));
};
