(function(){
'use strict';

angular.module('kitchenapp')
  .controller('IngredientsCtrl', IngredientsCtrl);

IngredientsCtrl.$inject = ['Ingredients', '$scope', '$q', '$log', 'uiGridConstants', 'Shopping', 'Cupboard'];

function IngredientsCtrl(Ingredients, $scope, $q, $log, uiGridConstants, Shopping, Cupboard) {

	var vm = this, ingredients, rowTemplate, data = [];

		ingredients = Ingredients.get();
		$log.log('list controller ings', ingredients);

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
		      { name: 'name', field: 'name' },
		      { name: 'Price', field: 'price', enableFiltering: false, cellFilter : 'currency:"£"' },
		      { name: 'Quantity', field: 'quantity',enableFiltering: false },
		      { name: 'Description', field: 'description' }]
		};

    $scope.gridOptions.multiSelect = true;


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

		$log.log(ingredients);

		$q.when(ingredients, function(newData){
			$scope.gridOptions.data = newData;
		});

    function addToCupboard(){
      var selectedIngs = $scope.gridApi.selection.getSelectedGridRows(), i, len = selectedIngs.length, thisIng;
      $log.log(selectedIngs);
      selectedIngs = _.pluck(selectedIngs, 'entity');
      $log.log(selectedIngs);

      for(i=0; i<len; i+=1){
        thisIng = {
          ingredient: selectedIngs[i]._id,
          reservedFor: null
        };

        selectedIngs[i] = thisIng;

      }

      Cupboard.bulkAdd(selectedIngs);

    }

    function addToShopping(){
      var selectedIngs = $scope.gridApi.selection.getSelectedGridRows();
      $log.log(selectedIngs);
      selectedIngs = _.pluck(selectedIngs, 'entity');
      $log.log(selectedIngs);
      Shopping.bulkAdd(selectedIngs);
    }

    function clear(){
      $scope.gridApi.selection.clearSelectedRows();
      $('button').blur();
    }


	angular.extend(vm, {
	  name: 'IngredientsCtrl',
    addToShopping: addToShopping,
    addToCupboard: addToCupboard,
    clear: clear
	});


}

}());
