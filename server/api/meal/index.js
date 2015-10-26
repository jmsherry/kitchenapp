(function () {
  'use strict';

  var express = require('express');
  var router = express.Router();
  var controller = require('./meal.controller');

  router.get('/', controller.getMeals);

  /**
   * @api {get} /user/:id/meals/:mealid Request User meals
   * @apiName GetMeal
   * @apiGroup Meals
   *
   * @apiParam {Number} id User's unique ID.
   * @apiParam {Number} mealid Meal's unique ID.
   *
   * @apiSuccess {String} owner oid of the owner.
   * @apiSuccess {String} name name of the meal.
   * @apiSuccess {String} description description of the meal.
   * @apiSuccess {String} imageURL A url for an image of the meal.
   * @apiSuccess {Object} ingredients An objects representing the meal's ingredients.
   *     @apiSuccess {Array} ingredients.present An array of cupboard item oids.
   *     @apiSuccess {Array} ingredients.missing An array of shopping list item oids.
   * @apiSuccess {Boolean} isComplete A flag for when the meal is complete.
   * @apiSuccess {Boolean} hasBeenStrategised A flag for when the meal has been processed via the inventory.
   * @apiSuccess {String} recipe oid of the recipe for this meal.
   * @apiSuccess {String} startsAt UTC date string for the day the meal is scheduled.
   *
   * @apiSuccessExample Success-Response:
   *     HTTP/1.1 200 OK
   * {
   *     owner: {type: ObjectId, ref: 'User'},
   *     name: {type: String, required: true},
   *     description: {type: String, required: true},
   *     imageURL: {type: String, validate: validators.isURL({skipEmpty: true})},
   *     ingredients: {
   *         present:[{
   *           type: ObjectId,
   *           ref: 'CupboardItem'
   *         }],
   *         missing:[{
   *           type: ObjectId,
   *           ref: 'ShoppingListItem'
   *         }]
   *     },
   *     isComplete: {type:Boolean, required: true},
   *     hasBeenStrategised:  {type:Boolean, required: false},
   *     recipe: {type: ObjectId, ref: 'Recipe', required: true},
   *     startsAt: {type: Date, default: null, null: true}
   * }
   *
   * @apiError MealNotFound JSON object with error code.
   *
   * @apiErrorExample Error-Response:
   *     HTTP/1.1 404 Not Found
   *     {
   *       "error": "MealNotFound"
   *     }
   *
   */
  router.get(':mealid', controller.getMeal);
  router.post('/', controller.addToMeals);
  router.put('/:mealid', controller.updateMeal);
  router.delete('/:mealid', controller.removeFromMeals);

  module.exports = router;
}());
