'use strict';

//NEVER TESTED (as we have no sprites)

var gulp = require('gulp');
var sprite = require('gulp-sprite-generator');

module.exports = function() {
    var spriteOutput;

    spriteOutput = gulp.src("./src/css/*.css")
        .pipe(sprite({
            baseUrl:         "./src/image",
            spriteSheetName: "sprite.png",
            spriteSheetPath: "/dist/image"
        }));

    spriteOutput.css.pipe(gulp.dest("./dist/css"));
    spriteOutput.img.pipe(gulp.dest("./dist/image"));
};
