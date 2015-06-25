'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./recipe.controller');

router.get('/', controller.getRecipes);
router.post('/', controller.create);

module.exports = router;
