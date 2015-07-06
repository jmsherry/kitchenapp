(function(){
'use strict';

angular.module('kitchenapp')
  .controller('IngredientsCtrl', IngredientsCtrl);

IngredientsCtrl.$inject = ['Ingredients', '$scope', '$q', '$log', 'uiGridConstants', 'Shopping', 'Cupboard'];

function IngredientsCtrl(Ingredients, $scope, $q, $log, uiGridConstants, Shopping, Cupboard) {

	var vm = this, ingredients, rowTemplate, data = [];

		ingredients = Ingredients.get();
		console.log('list controller ings', ingredients);

		rowTemplate = '<div ng-class="{ \'my-css-class\': grid.appScope.rowFormatter( row ) }">' +
         '  <div ng-repeat="(colRenderIndex, col) in colContainer.renderedColumns track by col.colDef.name" class="ui-grid-cell" ng-class="{ \'ui-grid-row-header-cell\': col.isRowHeader }"  ui-grid-cell></div>' +
         '</div>';

		$scope.gridOptions = {
      enableRowSelection: true,
      enableSelectAll: true,
			enableFiltering: true,
      selectionRowHeaderWidth: 35,
	    	rowTemplate: rowTemplate,
	    	data: data,
		    columnDefs: [
		      { name: 'name' },
		      { name: 'price', enableFiltering: false },
		      { name: 'quantity', enableFiltering: false },
		      { name: 'description' }]
		};

    $scope.gridOptions.multiSelect = true;

    $scope.setSelectable = function() {
      $scope.gridApi.selection.clearSelectedRows();

      $scope.gridOptions.isRowSelectable = function(row){
        if(row.entity.age > 30){
          return false;
        } else {
          return true;
        }
      };
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.OPTIONS);

      $scope.gridOptions.data[0].age = 31;
      $scope.gridApi.core.notifyDataChange(uiGridConstants.dataChange.EDIT);
    };

    $scope.gridOptions.onRegisterApi = function(gridApi){
      //set gridApi on scope
      $scope.gridApi = gridApi;
      gridApi.selection.on.rowSelectionChanged($scope,function(row){
        var msg = 'row selected ' + row.isSelected;
        $log.log(msg);
      });

      gridApi.selection.on.rowSelectionChangedBatch($scope,function(rows){
        var msg = 'rows changed ' + rows.length;
        $log.log(msg);
      });
    };

		console.log(ingredients);

		$q.when(ingredients, function(newData){
			$scope.gridOptions.data = newData;
		});

    function addToCupboard(){
      var selectedIngs = $scope.gridApi.selection.getSelectedGridRows();
      console.log(selectedIngs);
      selectedIngs = _.pluck(selectedIngs, 'entity');
      console.log(selectedIngs);
      Cupboard.bulkAdd(selectedIngs);
    }

    function addToShopping(){
      var selectedIngs = $scope.gridApi.selection.getSelectedGridRows();
      console.log(selectedIngs);
      selectedIngs = _.pluck(selectedIngs, 'entity');
      console.log(selectedIngs);
      Shopping.bulkAdd(selectedIngs);
    }

    function clear(){
      $scope.gridApi.selection.clearSelectedRows();
    }


	angular.extend(vm, {
	  name: 'IngredientsCtrl',
    addToShopping: addToShopping,
    addToCupboard: addToCupboard,
    clear: clear
	});


}

}());
