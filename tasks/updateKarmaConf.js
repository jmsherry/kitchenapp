'use strict';

/**
 * Inject css/js files in karma.conf
 */

 var gulp        = require('gulp');
 var bowerFiles  = require('main-bower-files'); //fn that returns the main component files
 var angularFilesort    = require('gulp-angular-filesort');
 var naturalSort = require('gulp-natural-sort');
 var headScripts = require('./config/headScripts');
 var inject      = require('gulp-inject');
 var _           = require('lodash');
 var jsToInject    = require('./config/filesToInject').js; //user files
 var toExclude   = require('./config/bowerFilesToExclude');

module.exports = function(){
  var bowerFls, bowerBodyScripts, scripts;

  bowerFls = bowerFiles();
  bowerBodyScripts = bowerFls.filter(function(str){
    var match = /\.(js)$/ig.test(str);
    console.log(match, str);
    return match;
  });

  console.log('all', bowerBodyScripts, bowerBodyScripts.length);

  for(var i=0; i<headScripts.length; i+=1){
    bowerBodyScripts = _.pull(bowerBodyScripts, headScripts[i]);
  }

  console.log('filtered', bowerBodyScripts, bowerBodyScripts.length);

  scripts = headScripts.concat(bowerBodyScripts).concat(jsToInject);

  gulp.src('./karma.conf.js')
  .pipe(inject(gulp.src(scripts, {read: false}), {
    starttag: 'files: [',
    endtag: ']',
    ignorePath: toExclude,
    transform: function (filepath, file, i, length) {
      return '  "' + filepath.replace(/^(\/client\/\.)/,"") + '"' + (i + 1 < length ? ',' : '');
    }
  }))
  .pipe(gulp.dest('./'));
};
