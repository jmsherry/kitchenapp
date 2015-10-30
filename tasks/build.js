'use strict';

/**
 * Build task
 */

var gulp                 = require('gulp');
var path                 = require('path');
var sq                   = require('streamqueue');
var runSequence          = require('run-sequence');
var del                  = require('del');
var plumber              = require('gulp-plumber');
var sourcemaps           = require('gulp-sourcemaps');
var usemin               = require('gulp-usemin');
var cssRebaseUrls        = require('gulp-css-url-rebase');
var autoprefixer         = require('gulp-autoprefixer');
var minifyCss            = require('gulp-minify-css');
var angularTemplatecache = require('gulp-angular-templatecache');
var concat               = require('gulp-concat');
var ngAnnotate           = require('gulp-ng-annotate');
var uglify               = require('gulp-uglify');
var revAll               = require('gulp-rev-all');
var revToExclude         = require('./config/revFilesToExclude');

var toDelete = [];

module.exports = function (done) {
  runSequence(
    ['clean:dist', 'images'], //'sass'
    ['usemin', 'copy:dist'],
    ['scripts', 'cssmin'],
    //'images',
    'rev',
    'clean:finish',
    done);
};

gulp.task('clean:dist', function (done) {
  del(['dist/**', '!dist', '!dist/.git{,/**}'])
    .then(function () { done(); }).catch(done);
});

gulp.task('clean:finish', function (done) {
  del([
    '.tmp/**',
    'dist/client/app.{css,js}'
  ].concat(toDelete))
    .then(function () { done(); }).catch(done);
});

gulp.task('copy:dist', function () {
  var main = gulp.src(['server/**/*', 'package.json'], { base: './' });
  var assets = gulp.src('client/assets/**/*', { base: './' });
  var uiGridFonts  = gulp.src([
    'client/bower_components/angular-ui-grid/*.eot',
    'client/bower_components/angular-ui-grid/*.svg',
    'client/bower_components/angular-ui-grid/*.ttf',
    'client/bower_components/angular-ui-grid/*.woff'
  ], { base: './' }).pipe(gulp.dest('dist/'));

  return sq({ objectMode: true }, main, assets, uiGridFonts)
    .pipe(gulp.dest('dist/'));
});

gulp.task('usemin', ['inject'], function () {
  return gulp.src('client/index.html')
    .pipe(plumber())
    .pipe(usemin({ css: [cssRebaseUrls({ root: 'client' }), 'concat'] }))
    .pipe(gulp.dest('dist/client/'));
});

gulp.task('cssmin', function () {
  return gulp.src('dist/client/app.css')
    .pipe(autoprefixer())
    .pipe(minifyCss())
    .pipe(gulp.dest('dist/client/'));
});

gulp.task('scripts', function () {
  var views = gulp.src('client/views/**/*.html')
    .pipe(angularTemplatecache({
      root: 'views',
      module: 'kitchenapp'
    }));

  var tpls = gulp.src('client/directives/**/*.html')
    .pipe(angularTemplatecache({
      root: 'directives',
      module: 'kitchenapp'
    }));

  var app = gulp.src('dist/client/app.js');

  return sq({ objectMode: true }, app, views, tpls)
    .pipe(sourcemaps.init())
    .pipe(concat('app.js'))
    .pipe(ngAnnotate())
    .pipe(uglify())
    .pipe(sourcemaps.write('../maps'))
    .pipe(gulp.dest('dist/client/'));
});

gulp.task('rev', function () {

  var rev = new revAll({
    transformFilename: function (file, hash) {
      var filename = path.basename(file.path);
      if (revToExclude.indexOf(filename) !== -1) {
        return filename;
      }
      toDelete.push(path.resolve(file.path));
      var ext = path.extname(file.path);
      return path.basename(file.path, ext) + '.' + hash.substr(0, 8) + ext;
    }
  });

  return gulp.src('dist/client/**')
    .pipe(rev.revision())
    .pipe(gulp.dest('dist/client/'));
});
