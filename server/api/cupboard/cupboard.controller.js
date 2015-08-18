(function(){

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var User = require('./../user/user.model');
//var Cupboard = require('./cupboard.model');
var CupboardItem = require('./cupboardItem.model');
var _ = require('lodash');

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

  console.log('in addToCupboard \nreq.params',  req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);

  var item = new CupboardItem({
    owner: req._params.userid,
    ingredient: req.body.ingId,
    dateAdded: new Date(),
    reservedFor: req.body.reservedForId
  });

  console.log('new constructed item: ', item);

  item.save(function(err, item){
    console.log('in addToCupboard results', err, item);
    if(err){
      handleError(res, err);
    }
    console.log('sent item: ', item);
    return res.status(201).json(item);
  });


};

/**
 * Return the users cuboard.
 *
 * @param req
 * @param res
 */
exports.getCupboard = function getCupboard(req, res) {
  console.log('in getCupboard \nreq.params', req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);
  CupboardItem.find(
    {'owner': req._params.userid},
  function(err, items){
    console.log('in getCupboard results', err, items);
    if(err){
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

  console.log('in updateCupboard \nreq.params', req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);

  var newItem = req.body.item;
  newItem.ingredient = newItem.ingredient._id;

  CupboardItem.findByIdAndUpdate(
    req._params.itemid,
    newItem,
    {safe: true, upsert: true},
    function(err, item){
      console.log('in updateCupboard results', err, item);
      var item;

      if(err){
        handleError(res, err);
      }
      return res.status(200).json(item);
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
    req.params.itemid,
    {},
    function(err, item){
      console.log('in removeFromCupboard results', err, item);
      if(err){
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
  CupboardItem.findById(req.params.itemid, function(err, item){
    console.log('in getCupboardItem results', err, item);
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
