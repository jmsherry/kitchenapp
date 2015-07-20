'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./meals.controller');


router.get('/', controller.getMealsList);
router.get('/:itemid', controller.getMeal);
router.post('/', controller.addToMeals);
router.put('/:itemid', controller.updateMeal);
router.delete('/:itemid', controller.removeFromMealsList);

module.exports = router;
