(function(){
'use strict';

angular.module('kitchenapp')
  .controller('IngredientsCtrl', IngredientsCtrl);

IngredientsCtrl.$inject = ['Ingredients', '$scope', '$q'];

function IngredientsCtrl(Ingredients, $scope, $q) {

	var vm = this, ingredients, rowTemplate, data = [];

		ingredients = Ingredients.get();
		console.log('list controller ings', ingredients);

		rowTemplate = '<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ) }">' +
         '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
         '</div>';

		$scope.gridOptions = {
			enableFiltering: true,
	    	rowTemplate: rowTemplate,
	    	data: data,
		    columnDefs: [
		      { name: 'name' },
		      { name: 'price', enableFiltering: false },
		      { name: 'quantity', enableFiltering: false },
		      { name: 'description' }]
		};

		console.log(ingredients);

		$q.when(ingredients, function(newData){
			$scope.gridOptions.data = newData;
		});



	angular.extend(vm, {
	  name: 'IngredientsCtrl'
	});

	
}

}());
