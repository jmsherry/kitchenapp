(function(){

  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Types.ObjectId;
  var User = require('./../user/user.model');
  //var MealsList = require('./meal.model');
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

    var meal = new MealItem(req.body);
    meal.owner = req._params.userid;

    console.log('meal: ', meal);

    meal.save(function(err, ml){
      console.log('in addToMeals results', err, ml);
      if(err){
        handleError(res, err);
      }
      return res.status(201).json(ml);
    });

  };

  /**
   * Return the users cuboard.
   *
   * @param req
   * @param res
   */
  exports.getMeals = function getMeals(req, res) {
    console.log('in getMeals \nreq.params', req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);
    MealItem.find(
      {'owner': req._params.userid},
    function(err, meals){
      console.log('in getMeals results', err, meals);
      if(err){
        handleError(res, err);
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
    var newMeal = req.body.meal;

    MealItem.findByIdAndUpdate(
      req.params.mealid,
      newMeal,
      {new: true},
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
   * Removes an ingredient from the user's meal. new KEYWORD REMOVED BEFORE ObjectId
   *
   * @param req
   * @param res
   */
  exports.removeFromMeals = function removeFromMeals(req, res) {
    console.log('in removeFromMeal \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
    MealItem.findByIdAndRemove(
      req.params.mealid,
      {},
      function(err, item){
        console.log(err, item);
        if(err){
          handleError(res, err);
        }
        return res.status(200).json(item);
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
    MealItem.findById(req.params.itemid, function(err, meal){
      if(err){
        handleError(res, err);
      }

      if(!meal){
        return res.status(404).json({});
      }
      return res.status(200).json(meal);
    });
  };

}());
