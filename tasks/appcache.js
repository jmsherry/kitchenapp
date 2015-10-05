var path = require('path');
var mergeStream = require('merge-stream');
var gulp = require('gulp');
var manifest = require('gulp-manifest');

module.exports = function () {

  var config = {
    app: './../client',
    dist: './../dist/client'
  };

  console.log('in', config);

  mergeStream(
      gulp.src([
        path.join(config.dist + '/**/*.html'),
        path.join(config.dist + '/assets/images/*.{png,svg,jpg}'),
        path.join(config.dist + '/assets/fonts/*.*'),
        path.join(config.dist + '/**/*.js'),
        path.join(config.dist + '/**/*.css')
      ], {
        base: config.app
      }))
    .pipe(manifest({
      hash: true,
      preferOnline: false,
      network: ['*'],
      filename: 'appcache.manifest'
    }))
    .pipe(gulp.dest(config.dist));

};
