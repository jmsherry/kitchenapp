(function(){

  'use strict';
  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = mongoose.Types.ObjectId;
  var Transaction = require('./transaction.model');


  function handleError (res, err) {
    console.log(err);
    return res.sendStatus(500).send(err);
  }


  /**
   * Return the users accounts.
   *
   * @param req
   * @param res
   */
  exports.getPurchases = function getPurchases(req, res) {
    console.log('in getPurchases \nreq.params', req.params, '\nreq._params', req._params,  '\nreq.body: ', req.body);
    Transaction.find(
      {'owner': req._params.userid},
    function(err, items){
      console.log('in getPurchases results', err, items);
      if(err){
        handleError(res, err);
      }
      return res.status(200).json(items);
    });
  };

  /**
   * Return a purchase from the users accounts.
   *
   * @param req
   * @param res
   */
  exports.getPurchase = function getPurchase(req, res) {
    console.log('getPurchase req.params', req.params);
    Transaction.findById(req.params.purchaseid, function(err, item){
      console.log('in getPurchase results', err, item);
      if(err){
        handleError(res, err);
      }

      if(!item){
        return res.status(404).json(null);
      }
      return res.status(200).json(item);
    });
  };

}());
