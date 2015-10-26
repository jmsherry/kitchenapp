'use strict';

//NEVER TESTED (as we have no sprites)

var gulp = require('gulp');
var sprite = require('gulp-sprite-generator');

module.exports = function() {
    var srcFiles, spriteOutput;

    srcFiles = gulp.src("./../client/styles/css/*.css");
    spriteOutput = srcFiles.pipe(sprite({
            spriteSheetName: "sprite.png"
        }));

    spriteOutput.css.pipe(gulp.dest("./../dist/css"));
    spriteOutput.img.pipe(gulp.dest("./../dist/images/sprites"));
};
