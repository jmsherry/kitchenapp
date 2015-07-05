'use strict';

angular.module('kitchenapp')
  .controller('RecipesCtrl', RecipesCtrl);

  RecipesCtrl.$inject = ['$scope', 'Recipes', 'Ingredients', '$q'];


  function RecipesCtrl($scope, Recipes, Ingredients, $q) {

  	var vm = this,
  	recipes,
  	ingredients,
  	rowTemplate,
  	data = [],
  	editing;

		recipes = Recipes.get();

		rowTemplate = '<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ) }">' +
             '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
             '</div>';

		$scope.gridOptions = {
			enableFiltering: true,
	    	rowTemplate: rowTemplate,
	    	data: data,
		    columnDefs: [
		      { name: 'name', type: 'string' },
		      { name: 'description', type: 'string' },
		      { name: 'ingredients', type: 'string' }
		    ]
		};

		$q.when(recipes, function(newData){
			//console.log(newData[0]);

			_.each(newData, function(recipe){
				var ingredientsString = "";
				var ingredientsArray = _.pluck(recipe.ingredients, 'name');
				ingredientsString = ingredientsArray.join(", ");
				console.log(ingredientsString);
				recipe.ingredients = ingredientsString;
			});

			$scope.gridOptions.data = newData;
		});



	angular.extend(vm, {
	  name: 'RecipesCtrl',
	  editing: editing
	});

  }
