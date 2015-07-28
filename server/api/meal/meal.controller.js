(function(){

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var User = require('./../user/user.model');
var Meal = require('./meal.model');
var MealItem = require('./mealItem.model');

function handleError (res, err) {
  console.log(err);
  return res.sendStatus(500).send(err);
}

/**
 * Adds a new item to the user's meal.
 *
 * @param req
 * @param res
 */
exports.addToMeals = function addToMeals(req, res) {

  console.log('in addToMeal \nreq.params',  req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);

  var item = new MealItem(req.body);

  console.log('item: ', item);

  Meal.findOneAndUpdate(
    {"owner": req._params.userid},
    {$push: {'contents': item}},
    {safe: false, upsert: true},
    function(err, meal){
      console.log('in addToMeal results', err, meal);
      if(err){
        handleError(res, err);
      }
      console.log('sent item: ', item);
      return res.status(201).json(item);
    }
  );

};

/**
 * Return the users cuboard.
 *
 * @param req
 * @param res
 */
exports.getMeals = function getMeals(req, res) {
  console.log('in getMeal \nreq.params', req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);
  Meal.find(
    {'owner': req._params.userid},
  function(err, meals){
    console.log('in getMeal results', err, meals);
    if(err){
      handleError(res, err);
    }
    if(!meals){
      return res.status(404).json({});
    }
    return res.status(200).json(meals);
  });
};

/**
 * Updates an item to the user's meal.
 *
 * @param req
 * @param res
 */
exports.updateMeal = function updateMeal(req, res) {

  console.log('in updateMeal \nreq.params', req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);

  Meal.findOneAndUpdate(
    {"owner": req._params.userid},
    {$push: {'contents': req.body.item}},
    {safe: true, upsert: true},
    function(err, meal){
      console.log('in updateMeal results', err, meal);
      if(err){
        handleError(res, err);
      }
      return res.status(200).json(meal);
    }
  );

};

/**
 * Removes an ingredient from the user's meal.
 *
 * @param req
 * @param res
 */
exports.removeFromMeals = function removeFromMeals(req, res) {
  console.log('in removeFromMeal \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
  Meal.findOneAndUpdate(
    {"owner": req._params.userid},
    {$pull: {'contents': {_id: new ObjectId(req.params.itemid)}}},
    {safe: true},
    function(err, meal){
      console.log(err, meal);
      if(err){
        handleError(res, err);
      }
      if(!meal){
        return res.status(404).json({message: req.params.itemid + " not found in meal"});
      }
      return res.status(200).json(meal);
    }
  );
};



/**
 * Return an item from the users cuboard.
 *
 * @param req
 * @param res
 */
exports.getMeal = function getMeal(req, res) {
  console.log('getMealItem req.params', req.params);
  Meal.findOne({
    "owner": req._params.userid
  }, function(err, cup){
    if(err){
      handleError(res, err);
    }

    if(!cup){
      return res.status(404).json({});
    }
    return res.status(200).json(item);
  });
};

}());
