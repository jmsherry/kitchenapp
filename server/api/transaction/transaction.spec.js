'use strict';

require('should');

var server = require('../../server');
var request = require('supertest');

describe('GET /purchases', function () {

  it('should respond with a JSON collection of purchases', function (done) {
    request(server)
      .get('/api/purchases')
      .expect(200)
      .expect('Content-Type', /json/)
      .end(function (err, res) {

        if (err) {
          console.log(err);
          return done(err);
        }

        done();
      });
  });

});
