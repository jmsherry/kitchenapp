'use strict';
var gulp = require('gulp');
var EJSON = require('mongodb-extended-json');
var BSON = require('bson');
var eventsStream = require('event-stream');

function formatSeed() {
  // you're going to receive Vinyl files as chunks
  function transform(file, cb) {
    // read and modify file contents
    file.contents = new Buffer(String(file.contents) + ' some modified content');

    // if there was some error, just pass as the first parameter here
    cb(null, file);
  }

  // returning the map will cause your transform function to be called
  // for each one of the chunks (files) you receive. And when this stream
  // receives a 'end' signal, it will end as well.
  //
  // Additionally, you want to require the `event-stream` somewhere else.
  return eventsStream.map(transform);
}

module.exports = function(){
 return gulp.src('./seeds/**/*.json')
 .pipe(formatSeed())
 .pipe(gulp.dest('client/styles/css'));
};
