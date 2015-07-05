'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('GET /meals', function () {

  it('should respond with a JSON collection of meals', function (done) {
    request(server)
      .get('/api/meals')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {
        if (err) { return done(err); }
        console.log(err);
        done();
      });
  });

});
