(function(){
  'use strict';

  var mongoose = require('mongoose');
  var Schema = mongoose.Schema;

  var IngredientSchema = new Schema({
    name: {type: String, required: true},
    description: {type: String, required: true},
    imageURL: {type: String, default: ""},
    quantity: {type: String, required: true},
    price: {type: Number, required: true}
  });

  /**
   * Virtuals
   */


  /**
   * Validations
   */

  // IngredientSchema
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

  IngredientSchema.methods = {

  };

  module.exports = mongoose.model('Ingredient', IngredientSchema);

}());
