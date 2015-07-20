(function(){

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Schema.Types.ObjectId;
var User = require('./../user/user.model');
var Cupboard = require('./cupboard.model');

function handleError (res, err) {
  console.log(err);
  return res.sendStatus(500).send(err);
}

/**
 * Adds a new item to the user's cupboard.
 *
 * @param req
 * @param res
 */
exports.addToCupboard = function addToCupboard(req, res) {

  console.log('addItemToCupboard req.body ', req.body);

  Cupboard.update(
    {"owner": req.params.userid},
    {$push: {'cupboard': req.body.item}},
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
 * Return the users cuboard.
 *
 * @param req
 * @param res
 */
exports.getCupboard = function getCupboard(req, res) {
  console.log('In getCupboard req.params', req.params);
  Cupboard.findOne({owner: req.params.userId},
  function(err, cupboard){
    if(err){
      handleError(res, err);
    }
    if(!cupboard){
      return res.status(404).json({});
    }
    return res.status(200).json(cupboard);
  });
};

/**
 * Updates an item to the user's cupboard.
 *
 * @param req
 * @param res
 */
exports.updateCupboard = function updateCupboard(req, res) {

  console.log('updateCupboard req.body ', req.body);

  Cupboard.update(
    {"owner": req.params.userid},
    {$push: {'cupboard': req.body.item}},
    {safe: true, upsert: true, multi: true},
    function(err, resp){
      console.log(err, resp);
      if(err){
        handleError(res, err);
      }
      return res.status(201).json(resp);
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
  console.log('removeFromCupboard req.body', req.body);
  Cupboard.update(
    {"owner": req.params.userid},
    {$pull: {'contents': req.body.item}},
    //{safe: true, upsert: true},
    function(err, item){
      console.log(err, item);
      if(err){
        handleError(res, err);
      }
      if(!item){
        return res.status(404).json({message: req.body.item.name + " not found in cupboard"});
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
// exports.getCupboardItem = function getCupboardItem(req, res) {
//   console.log('getCupboardItem req.params', req.params);
//   Cupboard.findOne({
//     owner: req.params.userId
//   }, function(err, cup){
//     if(err){
//       handleError(res, err);
//     }
//
//     if(!cup){
//       return res.status(404).json({});
//     }
//     return res.status(200).json(item);
//   });
// };

}());
