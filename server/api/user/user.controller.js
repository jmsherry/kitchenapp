(function () {
  'use strict';

  var config = require('../../config/environment');
  var jwt = require('jsonwebtoken');
  var User = require('./user.model');
  // var Cupboard = require('./../cupboard/cupboard.model');
  // var Shopping = require('./../shopping/shopping.model');
  // var Meals = require('./../meal/meal.model');

  function handleError(res, err) {
    return res.status(500).send(err);
  }

  /**
   * Creates a new user in the DB.
   *
   * @param req
   * @param res
   */
  exports.create = function (req, res) {
    User.create(req.body, function (err, user) {
      if (err) {
        return handleError(res, err);
      }

      var token = jwt.sign({
          _id: user._id
        },
        config.secrets.session, {
          expiresInMinutes: 60 * 5
        }
      );
      res.status(201).json({
        token: token,
        user: user
      });

    });
  };

  /**
   * Creates a new user in the DB.
   *
   * @param req
   * @param res
   */
  exports.update = function (req, res) {
    console.log('in user.update \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
    var userId = req.params.userid;
    User.findOne({
        _id: userId
      }, '-salt -passwordHash')
      .populate({
        path: 'cupboard shopping meals'
      })
      .exec(function (err, user) {
        if (err) {
          return handleError(res, err);
        }
        if (!user) {
          return res.json(401);
        }
        console.log(user);
        user.budget = req.body.budget;
        user.email = req.body.email;
        user.save(function (err, updatedUser) {
          if (err) {
            return handleError(res, err);
          }
          res.status(200).json(updatedUser);
        });
      });
  };

  /**
   * Return the current logged user.
   *
   * @param req
   * @param res
   */
  exports.getMe = function (req, res) {
    var userId = req.user._id;
    User.findOne({
        _id: userId
      }, '-salt -passwordHash')
      .populate({
        path: 'cupboard shopping meals'
      })
      .exec(function (err, user) {
        if (err) {
          return handleError(res, err);
        }
        if (!user) {
          return res.json(401);
        }
        console.log(user);
        res.status(200).json(user);
      });
  };
}());
