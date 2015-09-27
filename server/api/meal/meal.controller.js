(function () {

  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Types.ObjectId;
  var User = require('./../user/user.model');
  var CupboardItem = require('./../cupboard/cupboardItem.model');
  var ShoppingItem = require('./../shopping/shoppingItem.model');
  var MealItem = require('./mealItem.model');
  var _ = require('lodash');
  var moment = require('moment');
  moment.createFromInputFallback = function(config) {
    // your favorite unreliable string magic, or
    config._d = new Date(config._i);
  };

  function handleError(res, err) {
    console.log('Error', err);
    return res.sendStatus(500).send(err);
  }

  /**
   * Adds a new item to the user's meal.
   *
   * @param req
   * @param res
   */
  exports.addToMeals = function addToMeals(req, res) {

    console.log('in addToMeal \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);

    var meal = _.extend(req.body, {
      owner: req._params.userid,
      hasBeenStrategised: false,
      isComplete: false
    });

    meal = new MealItem(meal);

    console.log('meal: ', meal);

    meal.save(function (err, ml) {
      console.log('in addToMeals results', err, ml);
      if (err) {
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
    console.log('in getMeals \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
    MealItem.find({
        'owner': req._params.userid
      },
      function (err, meals) {
        console.log('in getMeals results', err, meals);
        if (err) {
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

    console.log('in updateMeal \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);

    MealItem.findById(
      req.params.mealid,
      function (err, meal) {
        console.log('in updateMeal results', err, meal);

        if (err) {
          handleError(res, err);
        } else if (!meal) {
          handleError(res, new Error('No meal found to update'));
        }

        meal.owner = req.body.owner;
        meal.name = req.body.name;
        meal.description = req.body.description;
        meal.imageURL = req.body.imageURL;
        meal.ingredients = req.body.ingredients;
        meal.isComplete = req.body.isComplete;
        meal.hasBeenStrategised = req.body.hasBeenStrategised;
        meal.recipe = req.body.recipe;
        meal.startsAt = moment(req.body.startsAt).toDate();

        console.log('original', meal.startAt, 'finished', moment(req.body.startsAt).toDate());

        meal.save(function (err, ml) {
          if (err) {
            handleError(res, err);
          }
          return res.status(200).json(ml);
        });

        // {
        //   owner: req.body.owner,
        //   name: req.body.name,
        //   description: req.body.description,
        //   imageURL: req.body.imageURL,
        //   ingredients: req.body.ingredients,
        //   isComplete: req.body.isComplete,
        //   hasBeenStrategised: req.body.hasBeenStrategised,
        //   recipe: req.body.recipe,
        //   starts_at: req.body.starts_at
        // },
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
      req.params.mealid, {},
      function (err, item) {
        console.log(err, item);
        if (err) {
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
    MealItem.findById(req.params.itemid, function (err, meal) {
      if (err) {
        handleError(res, err);
      }

      if (!meal) {
        return res.status(404).json({});
      }
      return res.status(200).json(meal);
    });
  };

}());
