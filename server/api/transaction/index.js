'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./transaction.controller');

router.get('/', controller.getPurchases);
router.get('/:purchaseid', controller.getPurchase);

module.exports = router;
