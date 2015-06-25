'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var RecipeSchema = new Schema({
  name: {type: String, required: true},
  description: {type: String, required: true},
  imageURL: {type: String, validate: validators.isURL()},
  ingredients: [{
      type: ObjectId,
      ref: 'Ingredient',
      required: true
  }],
});

/**
 * Virtuals
 */


/**
 * Validations
 */

// RecipeSchema
//   .path('name')
//   .validate(function (value, respond) {
//     var self = this;
//     this.constructor.findOne({ name: value }, function (err, ingredient) {
//       if (err) { throw err; }
//       if (ingredient) {
//         if (self.id === ingredient.id) { return respond(true); }
//         return respond(false);
//       }
//       respond(true);
//     });
//   }, 'Ingredient already entered');

/**
 * Methods
 */

RecipeSchema.methods = {

};

module.exports = mongoose.model('Recipe', RecipeSchema);
