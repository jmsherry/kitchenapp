'use strict';

var config = require('../../config/environment');
var Meal = require('./meal.model');
var MealsList = require('./mealsList.model');

function handleError (res, err) {
  console.log(err);
  return res.status(500).send(err);
}

/**
 * Gets the current users meals list.
 *
 * @param req
 * @param res
 */
exports.getMealsList = function getMealsList(req, res) {
  MealsList.find({
    owner: req.params.userid
  })
  .populate('meals')
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


/**
 * Return the current logged user.
 *
 * @param req
 * @param res
 */
exports.getMeal = function getMeal(req, res) {
  MealsList.find({
    owner: req.params.userid
  })
  .populate('meals')
  .exec(function (err, MlsList) {
    if (err) { return handleError(res, err); }
    var meals = MlsList.meals, meal;
    meal = _.find(meals, {id: req.params.itemid})
    if (!meal) {
      console.log('no meals');
      return res.json(401);
    }
    console.log(meals);
    res.status(200).json(meal);
  });
};

/**
 * Creates a new user in the DB.
 *
 * @param req
 * @param res
 */
exports.addToMeals = function addToMeals(req, res) {
  //console.log(req.headers);
  MealsList.findOneAndUpdate({
      owner: req.params.userid
    },
    {$push: {'meals': req.body.item}},
    {safe: true, upsert: true},
    function(err, item){
      console.log(err, item);
      if(err){
        handleError(res, err);
      }
      return res.status(201).json(item);
    }
  );
};

exports.updateMeal = function updateMeal(req, res) {
  var updatedMeal = req.body.meal;
  Meals.find({
    owner: req.body._id
  })
  .populate('meals')
  .exec(function (err, meals) {
    if (err) { return handleError(res, err); }
    //getIndex

    //remove old model
    console.log(meals);
    res.status(200).json({meals: meals, model: updatedModel});
  });
};

exports.removeFromMealsList = function removeFromMealsList(req, res) {
  MealsList.findOneAndUpdate(
    {"owner": req.params.userid},
    {$pull: {'meals': req.body.itemid}},
    //{safe: true, upsert: true},
    function(err, item){
      console.log(err, item);
      if(err){
        handleError(res, err);
      }
      if(!item){
        return res.status(404).json({});
      }
      return res.status(200).json(item);
    }
  );
};
