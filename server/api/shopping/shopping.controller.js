'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var ShoppingList = require('./shopping.model');

function handleError (res, err) {
  return res.sendStatus(500).send(err);
}

/**
 * Adds a new ingredient to the user's cupboard.
 *
 * @param req
 * @param res
 */
exports.addToShoppingList = function addToShoppingList(req, res) {
  console.log('in addToShoppingList req.params', req.params);
	ShoppingList.findOneAndUpdate(
    {"owner": req.params.userid},
    {$push: {'contents': req.body.item._id}},
    {safe: true, upsert: true, multi: true},
    function(err, item){
      console.log(err, item);
      if(err){
        handleError(res, err);
      }
      return res.status(201).json(item);
    }
  );
};

/**
 * Updates an ingredient in the user's shopping list.
 *
 * @param req
 * @param res
 */
exports.updateShoppingList = function updateShoppingList(req, res) {
	ShoppingList.findOneAndUpdate(
    {"owner": req.params.userid},
    {$push: {'contents': req.body.item}},
    {safe: true, upsert: false, multi: true},
    function(err, item){
      console.log(err, item);
      if(err){
        handleError(res, err);
      }
      if (!item ){
        console.log('no SL item to update');
        return res.status(404).json({});
      }
      return res.status(200).json(item);
    }
  );
};

/**
 * Removes an ingredient from the user's shopping list.
 *
 * @param req
 * @param res
 */
exports.removeFromShoppingList = function removeFromShoppingList(req, res) {
	console.log('in removeFromShoppingList req.params', req.params);
	ShoppingList.findOneAndUpdate(
    {"owner": req.params.userid},
    {$pull: {'contents': {_id: req.params.itemid}}},
    function(err, item){
      //console.log(err, Model);
      if(err){
        handleError(res, err);
      }
      if (!item) {
        console.log('no SL item to remove');
        return res.status(404).json({});
      }
      return res.status(200).json(item);
    }
  );
};

/**
 * Return the users shopping list.
 *
 * @param req
 * @param res
 */
exports.getShoppingList = function getShoppingList(req, res) {
	console.log('req.params', req.params);
  ShoppingList.findOne(
    {"owner": req.params.userid},
    function(err, shoppingList){
      //console.log(err, shoppingList);
      if(err){
        handleError(res, err);
      }
      if (!shoppingList) {
        console.log('no SL item to remove');
        return res.status(404).json({});
      }
      return res.status(200).json(shoppingList);
    }
  );
};

/**
 * Return an item from the users shopping list.
 *
 * @param req
 * @param res
 */
exports.getShoppingListItem = function getShoppingListItem(req, res) {
  console.log('getShoppingListItem req.params');
  ShoppingList.findOne(
    {"owner": req.params.userid},
    function(err, shoppingList){
      if(err){
        handleError(res, err);
      }
      console.log('get SL item args: ', arguments);
      var item = _.find(shoppingList, {itemid: req.params.itemid})
      return res.status(200).json(item);
    }
  );
};
