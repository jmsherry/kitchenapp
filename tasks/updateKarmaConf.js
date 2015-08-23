'use strict';

/**
 * Inject css/js files in karma.conf
 */

var gulp       = require('gulp');
var bowerFiles = require('main-bower-files'); //main component files
var headScripts = require('./config/headScripts');
var inject     = require('gulp-inject');

var toInject   = require('./config/filesToInject'); //user files
var toExclude  = require('./config/bowerFilesToExclude');

module.exports = function(){
  var scripts = headScripts.concat(bowerFiles().concat(toInject));

  gulp.src('./karma.conf.js')
  .pipe(inject(gulp.src(scripts, {read: false})), {
    starttag: 'files: [',
    endtag: ']',
    ignorePath: toExclude,
    transform: function (filepath, file, i, length) {
      return '  "' + filepath + '"' + (i + 1 < length ? ',' : '');
    }
  })
  .pipe(gulp.dest('./'));
};
