'use strict';

/**
 * Serve app. For dev purpose.
 */

var gulp       = require('gulp');
var ripe       = require('ripe');
var nodemon    = require('gulp-nodemon');
var open       = require('gulp-open');
var bsync      = require('browser-sync');

var config = require('../server/config/environment');

var openOpts = {
  uri: 'http://localhost:' + config.port,
  already: false
};

module.exports = {

  nodemon: function (cb) {
    return nodemon({
        script: 'server/server.js',
        ext: 'js',
        ignore: ['client', 'dist', 'node_modules', 'gulpfile.js']
      })
      .on('start', function () {
        if (!openOpts.already) {
          openOpts.already = true;
          ripe.wait(cb);
        } else {
          ripe.wait(function () {
            bsync.reload({ stream: false });
          });
        }
      });
  },

  bsync: function () {
    bsync.init({
      proxy: 'localhost:9000',
      browser: process.env.BROWSER || 'google chrome',
      online: false,
      notify: false,
      watchOptions: {
        interval: 500
      }
    });
  }

};
