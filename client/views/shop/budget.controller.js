'use strict';

angular.module('kitchenapp')
  .controller('BudgetCtrl', BudgetCtrl);

BudgetCtrl.$inject = ['Shopping', 'Auth', '$q', 'Meals', '$log', '$scope'];

  function BudgetCtrl(Shopping, Auth, $q, Meals, $log, $scope) {

    Auth.checkAuthorised();

    var vm = this,
    user = Auth.getUser(),
    budget = user.budget;

    $scope.data = [
      {x: new Date(2015, 8, 16), value: budget - 4, guide: budget},
      {x: new Date(2015, 8, 17), value: budget - 8, guide: (budget * (6/7))},
      {x: new Date(2015, 8, 18), value: budget - 15, guide:  budget * (5/7)},
      {x: new Date(2015, 8, 19), value: budget - 16, guide:  budget * (4/7)},
      {x: new Date(2015, 8, 20), value: budget - 23, guide:  budget * (3/7)},
      {x: new Date(2015, 8, 21), value: budget - 32, guide:  budget * (2/7)},
      {x: new Date(2015, 8, 22), value: budget - 43, guide:  budget * (1/7)}
    ];

    $scope.options = {
      axes: {
        x: {key: 'x', type: 'linear', ticks: 7, ticksFormatter: function(date){return moment(date).format("ddd Do")}},
        y: {type: 'linear', min: -budget/2, max: budget, ticks: 10}
      },
      margin: {
        left: 30
      },
      series: [
        {y: 'value', color: 'steelblue', thickness: '2px', type: 'area', striped: true, label: 'Achieved Budget'},
        {y: 'guide', color: 'red', thickness: '2px', type: 'area', striped: true, label: 'Target Budget'}
      ],
      lineMode: 'linear',
      tension: 0.7,
      tooltip: {mode: 'scrubber', formatter: function(x, y, series) {return '£' + y.toFixed(2);}},
      drawLegend: true,
      drawDots: true,
      hideOverflow: false,
      columnsHGap: 7
    }

    angular.extend(vm, {
      name: 'BudgetCtrl'
    });

  }
