var gulp = require('gulp'),
  apidoc = require('gulp-apidoc'),
  apidoc2md = require('gulp-apidoc-to-markdown');

module.exports = function (done) {

  apidoc2md.generate(process.cwd() + "/dist/docs/", process.cwd() + "/dist/docs/api.md");

  apidoc({
    src: "server/",
    dest: "dist/"
  }, done);

};
