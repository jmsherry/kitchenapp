'use strict';

var mongoose = require('mongoose');
var Schema = mongoose.Schema;
//var CupboardItemSchema = require('./cupboardItem.model.js');
var ObjectId = Schema.ObjectId;

var CupboardSchema = new Schema({
  owner: {type: ObjectId, ref: 'User'},
  contents: []
});

/**
 * Virtuals
 */


/**
 * Validations
 */

// CupboardSchema
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

CupboardSchema.methods = {

};

module.exports = mongoose.model('Cupboard', CupboardSchema);