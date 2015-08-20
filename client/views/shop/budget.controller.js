'use strict';

angular.module('kitchenapp')
  .controller('BudgetCtrl', BudgetCtrl);

BudgetCtrl.$inject = ['Shopping', 'Auth', '$q', 'Meals', '$log', '$scope'];

  function BudgetCtrl(Shopping, Auth, $q, Meals, $log, $scope) {

    Auth.checkAuthorised();

    var vm = this,
    user = Auth.getUser(),
    budget = user.budget;


    $scope.data = [{
    key: "Cumulative Return",
    values: [
        { "label" : "Monday" , "value" : -29.765957771107 },
        { "label" : "Tuesday" , "value" : 0 },
        { "label" : "Wednesday" , "value" : 32.807804682612 },
        { "label" : "Thursday" , "value" : 196.45946739256 },
        { "label" : "Friday" , "value" : 0.19434030906893 },
        { "label" : "Saturday" , "value" : -98.079782601442 },
        { "label" : "Sunday" , "value" : -13.925743130903 }
    ]
}];

$scope.options = {
    chart: {
        type: 'discreteBarChart',
        height: 450,
        margin : {
            top: 20,
            right: 20,
            bottom: 60,
            left: 55
        },
        x: function(d){ return d.label; },
        y: function(d){ return d.value; },
        showValues: true,
        valueFormat: function(d){
            return d3.format(',.4f')(d);
        },
        transitionDuration: 500,
        xAxis: {
            axisLabel: 'X Axis'
        },
        yAxis: {
            axisLabel: 'Y Axis',
            axisLabelDistance: 30
        }

    }
};

    angular.extend(vm, {
      name: 'BudgetCtrl'
    });

  }
