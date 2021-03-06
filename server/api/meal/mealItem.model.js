(function(){
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
          ref: 'CupboardItem'
      }],
      missing:[{
          type: ObjectId,
          ref: 'ShoppingListItem'
      }]
    },
    isComplete: {type:Boolean, required: true},
    hasBeenStrategised:  {type:Boolean, required: false},
    recipe: {type: ObjectId, ref: 'Recipe', required: true},
    startsAt: {type: Date, default: null, null: true}
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

}());
