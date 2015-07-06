'use strict';

var config = require('../../config/environment');
var Meal = require('./meal.model');

function handleError (res, err) {
  console.log(err);
  return res.status(500).send(err);
}

/**
 * Creates a new user in the DB.
 *
 * @param req
 * @param res
 */
exports.create = function (req, res) {
  console.log(req.headers);
  console.log('req.body', req.body);
  var i, newMeal = req.body,
  presentIngredients = newMeal.ingredients.present,
  missingIngredients = newMeal.ingredients.missing,
  presentLength = presentIngredients.length,
  missingLength = missingIngredients.length;

  for(i=0; i < presentLength; i+=1){
    presentIngredients[i] = presentIngredients[i]._id;
  }

  for(i=0; i < missingLength; i+=1){
    missingIngredients[i] = missingIngredients[i]._id;
  }

  console.log('newMeal: ', newMeal);
  Meal.create(newMeal, function (err, meal) {
    if (err) { return handleError(res, err); }
    res.status(201).json({ meal: meal });
  });
};

/**
 * Return the current logged user.
 *
 * @param req
 * @param res
 */
exports.getMeals = function (req, res) {
  Meal.find({})
  .populate('ingredients.missing, ingredients.present')
  .exec(function (err, meals) {
    if (err) { return handleError(res, err); }
    if (!meals) {
      console.log('no meals');
      return res.json(401);
    }
    console.log(meals);
    res.status(200).json(meals);
  });
};
