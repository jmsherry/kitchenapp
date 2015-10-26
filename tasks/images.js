'use strict';

/**
 * Optimise and move image assets
 */

var gulp = require('gulp');
var imagemin = require('gulp-imagemin');
var pngquant = require('imagemin-pngquant');
var destination;

module.exports = function () {

    return gulp.src('client/assets/images/*')
        .pipe(imagemin({
            progressive: true,
            svgoPlugins: [{removeViewBox: false}],
            use: [pngquant()]
        }))
        .pipe(gulp.dest('client/assets/images/optimised'));
};
