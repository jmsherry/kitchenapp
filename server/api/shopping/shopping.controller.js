(function(){
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Types.ObjectId;
  //var ShoppingList = require('./shopping.model');
  var ShoppingListItem = require('./shoppingItem.model');

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

    var item = new ShoppingListItem({
      owner: req._params.userid,
      ingredient: req.body.ing,
      reservedFor: req.body.reservedFor
    });

  	item.save(function(err, item){
      console.log('in addToShoppingList results', err, item);
      if(err){
        handleError(res, err);
      }
      return res.status(201).json(item);
    });
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
    ShoppingListItem.find(
      {"owner": req._params.userid},
      function(err, shoppingList){
        console.log('getShoppingList results', err, shoppingList);
        if(err){
          handleError(res, err);
        }
        if (!shoppingList) {
          console.log('no SL found');
          return res.status(404).send([]);
        }
        return res.status(200).json(shoppingList);
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
  	console.log('in updateShoppingList \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
    ShoppingListItem.findByIdAndUpdate(
      req._params.itemid,
      newItem,
      {safe: true, upsert: true},
      function(err, item){
        console.log('in updateShoppingList results', err, item);
        var item;

        if(err){
          handleError(res, err);
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
  	console.log('in removeFromShoppingList \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
    ShoppingListItem.findByIdAndRemove(
      req.params.itemid,
      {},
      function(err, item){
        console.log('in removeFromShoppingList results', err, item);
        if(err){
          handleError(res, err);
        }
        return res.status(200).json(item);
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
    ShoppingListItem.findById(req.params.itemid, function(err, item){
      console.log('in getShoppingListItem results', err, item);
      if(err){
        handleError(res, err);
      }

      if(!item){
        return res.status(404).json({});
      }
      return res.status(200).json(item);
    });

  };
}());
