'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var MealItemSchema = require('./cupboardItem.model.js');
var ObjectId = Schema.ObjectId;

var MealsListSchema = new Schema({
  owner: {type: ObjectId, ref: 'User'},
  contents: []
});

/**
 * Virtuals
 */


/**
 * Validations
 */

// MealsListSchema
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

MealsListSchema.methods = {

};

module.exports = mongoose.model('MealsList', MealsListSchema);
