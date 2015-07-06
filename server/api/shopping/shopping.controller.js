'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./../user/user.model');

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
	User.findOneAndUpdate(
    {"_id": req.body.userid}, 
    {$push: {'shopping_list': req.body.itemid}},
    {safe: true, upsert: true},
    function(err, Model){
      console.log(err, Model);
      if(err){
        handleError(res, err);
      }
      return res.status(201).json(Model);
    }
  );
};

/**
 * Removes an ingredient from the user's cupboard.
 *
 * @param req
 * @param res
 */
exports.removeFromShoppingList = function removeFromShoppingList(req, res) {
	console.log('req.body', req.body);
	User.findOneAndUpdate(
    {"_id": req.body.userid}, 
    {$pull: {'shopping_list': req.body.itemid}},
    {safe: true, upsert: true},
    function(err, Model){
      //console.log(err, Model);
      if(err){
        handleError(res, err);
      }
      return res.status(200).json(Model);
    }
  );
};

/**
 * Return the users cuboard. // Maybe not necessary...
 *
 * @param req
 * @param res
 */
exports.getShoppingList = function getShoppingList(req, res) {
	console.log('req.params', req.params);
 	res.send(200);
};
