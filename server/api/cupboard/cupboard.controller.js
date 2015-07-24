(function(){

'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = mongoose.Types.ObjectId;
var User = require('./../user/user.model');
var Cupboard = require('./cupboard.model');
var CupboardItem = require('./cupboardItem.model');

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
    ingredient: req.body.item._id
  });

  console.log(item);

  Cupboard.findOneAndUpdate(
    {"owner": req._params.userid},
    {$push: {'contents': item}},
    {safe: false, upsert: true},
    function(err, cupboard){
      console.log('in addToCupboard results', err, cupboard);
      if(err){
        handleError(res, err);
      }
      return res.status(201).json(cupboard);
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
  console.log('in getCupboard \nreq.params', req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);
  Cupboard.findOne(
    {'owner': req._params.userid},
  function(err, cupboard){
    console.log('in getCupboard results', err, cupboard);
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
// exports.updateCupboard = function updateCupboard(req, res) {
//
//   console.log('in updateCupboard \nreq.params', req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);
//
//   Cupboard.findOneAndUpdate(
//     {"owner": req._params.userid},
//     {$push: {'contents': req.body.item}},
//     {safe: true, upsert: true},
//     function(err, cupboard){
//       console.log('in updateCupboard results', err, cupboard);
//       if(err){
//         handleError(res, err);
//       }
//       return res.status(200).json(cupboard);
//     }
//   );
//
// };

/**
 * Removes an ingredient from the user's cupboard.
 *
 * @param req
 * @param res
 */
exports.removeFromCupboard = function removeFromCupboard(req, res) {
  console.log('in removeFromCupboard \nreq.params', req.params, '\nreq._params', req._params, '\nreq.body: ', req.body);
  Cupboard.findOneAndUpdate(
    {"owner": req._params.userid},
    {$pull: {'contents': {ingredient: ObjectId(req.body.item._id)}}},
    {safe: true},
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
//     "owner": req._params.userid
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
