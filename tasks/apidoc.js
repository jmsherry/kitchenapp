"use strict";

var gulp = require('gulp'),
  apidoc = require('gulp-apidoc'),
  apidoc2md = require('gulp-apidoc-to-markdown');

module.exports = function (done) {

  apidoc2md.generate(process.cwd() + "/docs/api", process.cwd() + "/docs/api/api.md");

  apidoc({
    src: "./server/",
    dest: "./docs/api/",
    debug: true
  }, done);

};
