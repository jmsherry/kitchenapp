(function(){

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var User = require('./../user/user.model');
var MealsList = require('./meal.model');
var MealItem = require('./mealItem.model');
var _ = require('lodash');

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

  MealsList.findOneAndUpdate(
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
  console.log('in getMeals \nreq.params', req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);
  MealsList.findOne(
    {'owner': req._params.userid},
  function(err, meals){
    console.log('in getMeals results', err, meals);
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

  //console.log('in updateMeal \nreq.params', req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);

  MealsList.findOne(
    {"owner": req._params.userid},
    function(err, ML){
      //console.log('in updateMeal results', err, ML, req.body, req._params, req.params);
      if(err){
        handleError(res, err);
      }
      if(!ML){
        return res.status(404).json({msg: "No meal list found to update"});
      }
      var meal = _.find(ML.contents, {"_id": ObjectId(req.params.mealid)});
      if(!meal){
        return res.status(404).json({msg: "No meal found to update"});
      }
      //meal = req.body;
      meal.$save(function(m){
        console.log(arguments);
        return res.status(200).json(m);
      });

    }
  );

};

/**
 * Removes an ingredient from the user's meal. new KEYWORD REMOVED BEFORE ObjectId
 *
 * @param req
 * @param res
 */
exports.removeFromMeals = function removeFromMeals(req, res) {
  console.log('in removeFromMeal \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
  MealsList.findOneAndUpdate(
    {"owner": req._params.userid},
    {$pull: {'contents': {"_id": ObjectId(req.params.mealid)}}},
    {safe: true},
    function(err, meal){
      console.log(err, meal);
      if(err){
        handleError(res, err);
      }
      if(!meal){
        return res.status(404).json({message: req.params.mealid + " not found in meal"});
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
  MealsList.findOne({
    "owner": req._params.userid
  }, function(err, ML){
    if(err){
      handleError(res, err);
    }

    var meal = _.find(ML.contents, {_id: req.params.mealid});

    if(!cup){
      return res.status(404).json({});
    }
    return res.status(200).json(meal);
  });
};

}());
