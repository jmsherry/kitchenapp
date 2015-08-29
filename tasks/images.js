'use strict';

/**
 * Optimise and move image assets
 */

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var destination;

module.exports = function () {

  if (process.env.NODE_ENV === 'production'){
    destination = gulp.dest('dist/images');
  } else {
    destination = gulp.src('src/images/');
  }

    return gulp.src('src/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(destination);
};
