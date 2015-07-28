'use strict';

var crypto = require('crypto');
var mongoose = require('mongoose');
var validators = require('mongoose-validators');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;


var mealItemSchema = new Schema({
  owner: {type: ObjectId, ref: 'User'},
  name: {type: String, required: true},
  description: {type: String, required: true},
  imageURL: {type: String, validate: validators.isURL({skipEmpty: true})},
  ingredients: {
    present:[{
        type: ObjectId,
        ref: 'Ingredient'
    }],
    missing:[{
        type: ObjectId,
        ref: 'Ingredient'
    }]
  },
  isComplete: {type:Boolean, required: true},
  dateScheduled: {type: Date},
  recipe: {type: ObjectId, required: true}
});

/**
 * Virtuals
 */


/**
 * Validations
 */

// mealItemSchema
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

mealItemSchema.methods = {

};

module.exports = mongoose.model('MealItem', mealItemSchema);
