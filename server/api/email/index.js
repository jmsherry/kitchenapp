(function(){
  'use strict';

  var express = require('express');
  var router = express.Router();
  var controller = require('./email.controller');

  router.post('/', controller.forwardMail);

  module.exports = router;
}());
