'use strict';

/**
 * Inject css/js files in karma.conf
 */

 var gulp        = require('gulp');
 var inject      = require('gulp-inject');
 var scripts     = require('./getInjectableFilesList')();

module.exports = function(){

  gulp.src('./karma.conf.copy.js')
  .pipe(inject(gulp.src(scripts.getFullList(), {read: false}), {
    starttag: 'files: [',
    endtag: ']',
    transform: function (filepath, file, i, length) {
      return "'" + filepath.replace(/^(\/client\/)/,'') + "'" + (i + 1 < length ? "," : "");
    }
  }))
  .pipe(gulp.dest('./'));
};
