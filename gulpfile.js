/* globals process, require */
'use strict';

var gulp = require('gulp');

process.env.NODE_ENV = process.env.NODE_ENV || 'development';

gulp.task('default',    ['serve']);

gulp.task('nodemon',    ['watch'],    require('./tasks/serve').nodemon);
gulp.task('serve',      ['nodemon'],  require('./tasks/serve').bsync);
gulp.task('watch',      ['inject'],   require('./tasks/watch'));
gulp.task('inject',     ['sass'],     require('./tasks/inject'));
gulp.task('sass',                     require('./tasks/sass'));
gulp.task('images',                   require('./tasks/images'));
gulp.task('sprite',                   require('./tasks/spriting'));
gulp.task('preview',    ['build'],    require('./tasks/preview'));
gulp.task('build',                    require('./tasks/build'));
gulp.task('bump',       ['version'],  require('./tasks/chore').bump);
gulp.task('version',                  require('./tasks/chore').version);
gulp.task('control',                  require('./tasks/control'));
gulp.task('beautify',                 require('./tasks/beautify'));
gulp.task('templates',                require('./tasks/templates'));
gulp.task('updateKarmaConf',          require('./tasks/updateKarmaConf'));
gulp.task('e2e:update',               require('./tasks/test').e2eUpdate);
gulp.task('e2e',        ['serve'],    require('./tasks/test').e2eTests);
//gulp.task('test',        ['updateKarmaConf'],   require('./tasks/test').test);
gulp.task('test',                     require('./tasks/test').test);
gulp.task('sassdoc',                  require('./tasks/doc').sassdoc);
gulp.task('apidoc',                 require('./tasks/apidoc'));
//gulp.task('appcache',   ['build'],    require('./tasks/appcache'));
gulp.task('appcache',                 require('./tasks/appcache'));
