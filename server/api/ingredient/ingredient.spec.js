'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('GET /ingredients', function () {

  it('should respond with a JSON collection of ingredients', function (done) {
    request(server)
      .get('/api/ingredients')
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { return done(err); }
        console.log(err);
        done();
      });
  });

});
