'use strict';

/**
 * Preprocess the angular templates
 */

var gulp          = require('gulp');
var templateCache = require('gulp-angular-templatecache');

module.exports = function () {
  return gulp.src(['client/views/**/*.html', 'client/directives/**/*.html'])
    .pipe(templateCache('templates.js', {module: 'kitchenapp.templates'}))
    .pipe(gulp.dest('client/templates'));
};
