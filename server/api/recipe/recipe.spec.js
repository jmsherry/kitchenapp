'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('GET /recipes', function () {

  it('should respond with a JSON collection of recipes', function (done) {
    request(server)
      .get('/api/recipes')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { return done(err); }
        console.log(err);
        done();
      });
  });

});
