(function(){

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
exports.addItemToCupboard = function addItemToCupboard(req, res) {

  User.findOneAndUpdate(
    {"_id": req.body.userid}, 
    {$push: {'cupboard': req.body.itemid}},
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
exports.removeItemFromCupboard = function removeItemFromCupboard(req, res) {
  console.log('req.body', req.body);
  User.findOneAndUpdate(
    {"_id": req.body.userid}, 
    {$pull: {'cupboard': req.body.itemid}},
    //{safe: true, upsert: true},
    function(err, Model){
      console.log(err, Model);
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
// exports.getCupboard = function getCupboard(req, res) {
//   console.log('req.params', req.params);
//   console.log('req.user', req.user);
//   res.send(200);
// };

}());
