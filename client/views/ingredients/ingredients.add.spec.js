// 'use strict';
//
// fdescribe('Controller: IngredientsAddCtrl', function () {
//
//   beforeEach(module('kitchenapp'));
//
//   var IngredientsAddCtrl,
//     Ingredients,
//     scope;
//
//   beforeEach(inject(function ($controller, $rootScope, _Ingredients_) {
//     scope = $rootScope.$new();
//     IngredientsAddCtrl = $controller('IngredientsAddCtrl', {
//       $scope: scope
//     });
//     Ingredients = _Ingredients_;
//   }));
//
//   it('should call add and reset the form', function () {
//       var controller, childScope, setPristine, setUntouched, save;
//
//       //controller = $controller('IngredientsAddCtrl', { $scope: $scope });
//
//       childScope = {
//         ingredientForm:{
//           $setPristine: function(){},
//           $setUntouched: function(){}
//         }
//       }
//
//       setPristine = spyOn(childScope.ingredientForm, '$setPristine');
//       setUntouched = spyOn(childScope.ingredientForm, '$setUntouched');
//       //save = spyOn(Ingredients, 'save');
//
//     //  scope.vm.addIngredient(childScope);
//
//       // expect(scope.vm.addIngredient).not.toBeUndefined();
//       // expect(setPristine).toHaveBeenCalled();
//       // expect(setUntouched).toHaveBeenCalled();
//       // expect(save).toHaveBeenCalled();
//   });
//
// });
