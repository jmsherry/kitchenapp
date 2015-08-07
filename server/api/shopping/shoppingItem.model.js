'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ShoppingItemSchema = new Schema({
  ingredient: {type: ObjectId, ref: 'Ingredient'},
  reservedFor: {type: ObjectId, ref: 'MealItem'}
});

/**
 * Virtuals
 */


/**
 * Validations
 */

// ShoppingItemSchema
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

ShoppingItemSchema.methods = {

};

module.exports = mongoose.model('ShoppingItem', ShoppingItemSchema);
