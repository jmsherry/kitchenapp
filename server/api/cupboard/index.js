'use strict';

var express = require('express');
var router = express.Router();
var controller = require('./cupboard.controller');

router.get('/:userId', controller.getCupboard);
router.post('/', controller.addItemToCupboard);
router.delete('/', controller.removeItemFromCupboard);

module.exports = router;
