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
  console.log('in addToShoppingList \nreq.params', req.params, '\nreq.body: ', req.body);
	ShoppingList.findOneAndUpdate(
    {"owner": req._params.userid},
    {$push: {'contents': ObjectId(req.body.item._id)}},
    {safe: true, upsert: true, multi: true},
    function(err, item){
      console.log('addToShoppingList results', err, item);
      if(err){
        handleError(res, err);
      }
      return res.status(201).json(item);
    }
  );
};

// /**
//  * Updates an ingredient in the user's shopping list.
//  *
//  * @param req
//  * @param res
//  */
// exports.updateShoppingList = function updateShoppingList(req, res) {
//   console.log('in updateShoppingList \nreq.params', req.params, '\nreq.body: ', req.body);
// 	ShoppingList.findOneAndUpdate(
//     {"owner": req._params.userid},
//     {$push: {'contents': req.body.item}},
//     {safe: true, upsert: false, multi: true},
//     function(err, item){
//       console.log('updateShoppingList results', err, item);
//       if(err){
//         handleError(res, err);
//       }
//       if (!item ){
//         console.log('no SL item to update');
//         return res.status(404).json({});
//       }
//       return res.status(200).json(item);
//     }
//   );
// };

/**
 * Removes an ingredient from the user's shopping list.
 *
 * @param req
 * @param res
 */
exports.removeFromShoppingList = function removeFromShoppingList(req, res) {
	console.log('in removeFromShoppingList \nreq.params', req.params, '\nreq.body: ', req.body);
	ShoppingList.findOneAndUpdate(
    {"owner": req._params.userid},
    {$pull: {'contents': ObjectId(req.params.itemid)}},
    function(err, item){
      console.log('removeFromShoppingList results', err, item);
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
  console.log('in getShoppingList \nreq', req._params);
	//console.log('in getShoppingList \nreq.params', req.params, '\nreq.body: ', req.body);
  ShoppingList.findOne(
    {"owner": req._params.userid},
    function(err, shoppingList){
      console.log('getShoppingList results', err, shoppingList);
      if(err){
        handleError(res, err);
      }
      if (!shoppingList) {
        console.log('no SL found');
        return res.status(404).send(null);
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
  console.log('in getShoppingListItem \nreq.params', req.params, '\nreq.body: ', req.body);
  ShoppingList.findOne(
    {"owner": req._params.userid},
    function(err, shoppingList){
      if(err){
        handleError(res, err);
      }
      console.log('getShoppingListItem results', err, shoppingList);
      var item = _.find(shoppingList.contents, {itemid: req.params.itemid})
      return res.status(200).json(item);
    }
  );
};
