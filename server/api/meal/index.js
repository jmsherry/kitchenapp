'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./meal.controller');


router.get('/', controller.getMeals);
router.get('/:itemid', controller.getMeal);
router.post('/', controller.addToMeals);
router.put('/:itemid', controller.updateMeal);
router.delete('/:itemid', controller.removeFromMeals);

module.exports = router;
