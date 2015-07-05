'use strict';

var config = require('../../config/environment');
var Ingredient = require('./ingredient.model');

function handleError (res, err) {
  console.log(err);
  return res.status(500).send(err);
}

/**
 * Creates a new ingredient in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  console.log('in');
  console.log(req.body);
  Ingredient.create(req.body, function (err, ingredient) {
    if (err) { return handleError(res, err); }
    res.status(201).json({ ingredient: ingredient });
  });
};

/**
 * Returns ingredients JSON array.
 *
 * @param req
 * @param res
 */
exports.getIngredients = function (req, res) {
  Ingredient.find({}, function (err, ingredients) {
    if (err) { return handleError(res, err); }
    //console.log(ingredients);
    res.status(200).json(ingredients);
  });
};
