(function(){
  'use strict';

  var express = require('express');
  var router = express.Router();
  var controller = require('./ingredient.controller');

  router.get('/', controller.getIngredients);
  router.post('/', controller.create);

  module.exports = router;
}());
