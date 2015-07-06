'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./shopping.controller');

router.get('/:userid', controller.getShoppingList);
router.post('/add', controller.addToShoppingList);
router.post('/delete', controller.removeFromShoppingList);

module.exports = router;
