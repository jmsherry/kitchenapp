'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./meal.controller');


router.get('/', controller.getMeals);
router.get(':mealid', controller.getMeal);
router.post('/', controller.addToMeals);
router.put('/:mealid', controller.updateMeal);
router.delete('/:mealid', controller.removeFromMeals);

module.exports = router;
