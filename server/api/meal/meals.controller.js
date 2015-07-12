'use strict';

var config = require('../../config/environment');
var Meal = require('./meal.model');
var Meals = require('./meals.model');

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
  //console.log(req.headers);
  console.log('req.body', req.body);
  Meals.create(newMeal, function (err, meal) {
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
  Meals.find({
    owner: req.body._id
  })
  .populate('contents')
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

exports.getMeals = function (req, res) {
  Meals.find({
    owner: req.body._id
  })
  .populate('contents')
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

exports.remove = function (req, res) {
  Meals.remove({
    owner: req.body._id
  }, function(err, removedModel){
    if (err) { return handleError(res, err); }
    res.status(200).json(removedModel);
  })
};
