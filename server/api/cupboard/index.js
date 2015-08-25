(function(){
  'use strict';

  var express = require('express');
  var router = express.Router();
  var controller = require('./cupboard.controller');

  router.get('/', controller.getCupboard);
  router.get('/:itemid', controller.getCupboardItem);
  router.post('/', controller.addToCupboard);
  router.put('/:itemid', controller.updateCupboard);
  router.delete('/:itemid', controller.removeFromCupboard);

  module.exports = router;
}());
