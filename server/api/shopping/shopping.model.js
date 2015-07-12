'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var ObjectId = Schema.ObjectId;

var ShoppingSchema = new Schema({
  owner: {type: ObjectId, ref: 'User'},
  contents: [
    {
        type: ObjectId,
        ref: 'Ingredient'
    }
  ]
});

/**
 * Virtuals
 */


/**
 * Validations
 */

// ShoppingSchema
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

ShoppingSchema.methods = {

};

module.exports = mongoose.model('Shopping', ShoppingSchema);
