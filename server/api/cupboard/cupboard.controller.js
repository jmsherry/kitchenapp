(function () {

  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Types.ObjectId;
  var User = require('./../user/user.model');
  var Ingredient = require('./../ingredient/ingredient.model');
  var CupboardItem = require('./cupboardItem.model');
  var Transaction = require('./../transaction/transaction.model');
  var moment = require('moment');
  //var _ = require('lodash');

  function handleError(res, err) {
    console.log(err);
    return res.sendStatus(500).send(err);
  }

  /**
   * Adds a new item to the user's cupboard. //you should next() the transaction at some stage after release
   *
   * @param req
   * @param res
   */
  exports.addToCupboard = function addToCupboard(req, res) {

    console.log('in addToCupboard \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);

    var item = new CupboardItem({
      owner: req._params.userid,
      ingredient: req.body.ingId,
      dateAdded: new Date(),
      reservedFor: req.body.reservedForId,
      bought: req.body.bought
    });

    console.log('new constructed item: ', item);

    item.save(function (err, item) {
      console.log('in addToCupboard results', err, item);
      if (err) {
        handleError(res, err);
      }
      console.log('sent item: ', item);
      return res.status(201).json(item);
    });

    //Consider where to place this and what to do with errors
    if (req.body.bought) {

      Ingredient.findOne({
        _id: req.body.ingId
      }, function (err, ing) {

        User.findById(
          req._params.userid,
          function (err, user) {

            var transaction = new Transaction({
              owner: req._params.userid,
              dateAdded: new Date().toUTCString(),
              amount: ing.price,
              currentBudget: user.budget,
              reservedFor: req.body.reservedForId,
              ingredient: req.body.ingId
            });

            transaction.save(function (err, item) {
              console.log('saving transaction', err, item);
              if (err) {
                //handleError(res, err);
                //throw new Error('transaction wasn\'t saved');
              }
            });
          });
      });

    }

  };

  /**
   * Return the users cuboard.
   *
   * @param req
   * @param res
   */
  exports.getCupboard = function getCupboard(req, res) {
    console.log('in getCupboard \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
    CupboardItem.find({
        'owner': req._params.userid
      })
      .populate('reservedFor')
      .exec(function (err, items) {
        console.log('in getCupboard results', err, items);
        if (err) {
          handleError(res, err);
        }
        return res.status(200).json(items);
      });
  };

  /**
   * Updates an item to the user's cupboard.
   *
   * @param req
   * @param res
   */
  exports.updateCupboard = function updateCupboard(req, res) {

    console.log('in updateCupboard \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);

    // CupboardItem.findByIdAndUpdate(
    //   req.params.itemid,
    //   req.body.item,
    //   {new: true},
    //   function(err, item){
    //     console.log('in updateCupboard results', err, item);
    //
    //     if(err){
    //       handleError(res, err);
    //     }
    //     return res.status(200).json(item);
    //   }
    // );

    CupboardItem.findOneAndUpdate({
        _id: req.params.itemid
      },
      req.body, {
        new: true
      },
      function successCB(err, updated) {
        if (err) {
          handleError(res, err);
        }
        if (!updated) {
          handleError(res, new Error('Update returned null'));
        } else {
          console.log('updated successfully', updated);
          return res.status(200).json(updated);
        }
      }

    );

  };

  /**
   * Removes an ingredient from the user's cupboard.
   *
   * @param req
   * @param res
   */
  exports.removeFromCupboard = function removeFromCupboard(req, res) {
    console.log('in removeFromCupboard \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
    CupboardItem.findByIdAndRemove(
      req.params.itemid, {},
      function (err, item) {
        console.log('in removeFromCupboard results', err, item);
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
  exports.getCupboardItem = function getCupboardItem(req, res) {
    console.log('getCupboardItem req.params', req.params);
    CupboardItem.findById(req.params.itemid, function (err, item) {
      console.log('in getCupboardItem results', err, item);
      if (err) {
        handleError(res, err);
      }

      if (!item) {
        return res.status(404).json(null);
      }
      return res.status(200).json(item);
    });
  };

}());
