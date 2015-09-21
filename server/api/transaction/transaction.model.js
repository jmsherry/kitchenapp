(function(){
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;
  var ObjectId = Schema.ObjectId;

  var TransactionSchema = new Schema({
    owner: {type: ObjectId, ref: 'User'},
    dateAdded: { type: Date, default: Date.now },
    amount: Number,
    currentBudget: Number
  });

  /**
   * Virtuals
   */


  /**
   * Validations
   */

  // TransactionSchema
  //   .path('title')
  //   .validate(function (value, respond) {
  //     var self = this;
  //     this.constructor.findOne({ title: value }, function (err, ingredient) {
  //       if (err) { throw err; }
  //       if (ingredient) {
  //         if (self.id === ingredient.id) { return respond(true); }
  //         return respond(false);
  //       }
  //       respond(true);
  //     });
  //   }, 'ingredient already present');

  /**
   * Methods
   */

  TransactionSchema.methods = {

  };

  module.exports = mongoose.model('Transaction', TransactionSchema);
}());
