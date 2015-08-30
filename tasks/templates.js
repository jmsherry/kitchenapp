'use strict';

/**
 * Inject css/js files in karma.conf
 */

var gulp          = require('gulp');
var templateCache = require('gulp-angular-templatecache');

module.exports = function () {
  return gulp.src(['client/views/**/*.html', 'client/directives/**/*.html'])
    .pipe(templateCache())
    .pipe(gulp.dest('client/templates'));
};
