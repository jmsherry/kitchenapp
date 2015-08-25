(function(){
  'use strict';

  var express = require('express');
  var router = express.Router();
  var controller = require('./shopping.controller');



  router.get('/', controller.getShoppingList);
  router.get('/:itemid', controller.getShoppingListItem);
  router.post('/', controller.addToShoppingList);
  //router.put('/:itemid', controller.updateShoppingList);
  router.delete('/:itemid', controller.removeFromShoppingList);

  module.exports = router;
}());
