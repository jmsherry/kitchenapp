'use strict';

describe('Controller: IngredientsCtrl', function () {

  beforeEach(module('kitchenapp'));

  var IngredientsCtrl,
    scope;

  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    IngredientsCtrl = $controller('IngredientsCtrl', {
      $scope: scope
    });
  }));

  it('should define gridOptions with 4 column headings', function () {
      var $scope = {}, controller;
      controller = $controller('IngredientsCtrl', { $scope: $scope });
      expect($scope.gridOptions).not.toBeUndefined();
      expect($scope.gridOptions.columnDefs.length).toBe(4);
  });

});
