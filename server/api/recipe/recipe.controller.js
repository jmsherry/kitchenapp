(function(){
  'use strict';

  var config = require('../../config/environment');
  var Recipe = require('./recipe.model');

  function handleError (res, err) {
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
    Recipe.create(req.body, function (err, recipe) {
      if (err) { return handleError(res, err); }
      res.status(201).json({ recipe: recipe });
    });
  };

  /**
   * Return the current logged user.
   *
   * @param req
   * @param res
   */
  exports.getRecipes = function (req, res) {
    Recipe.find({})
    .populate('ingredients')
    .exec(function (err, recipes) {
      if (err) { return handleError(res, err); }
      if (!recipes) {
        console.log('no recipes');
        return res.json(401);
      }
      console.log(recipes);
      res.status(200).json(recipes);
    });
  };
}());
