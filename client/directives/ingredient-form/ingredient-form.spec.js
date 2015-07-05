'use strict';

describe('Directive: nav-bar', function () {

  beforeEach(module('ngMock'));
  beforeEach(module('ui.router'));
  beforeEach(module('kitchenapp', 'templates'));


  var $httpBackend,
    $templateCache,
    $compile,
    $urlRouterProvider,
    $rootScope,
    $provide,
    Auth,
    element,
    $scope,
    links;

    beforeEach(function(){

      // module(function($provide){
      //   $provide.decorator('Auth', function($delegate) {
      //     $delegate.path = jasmine.createSpy();
      //     return $delegate;
      //   });
      // });

      // inject(function(_Auth_) {
      //   Auth = _Auth_;
      // });

    });

    beforeEach(inject(function (_$templateCache_) {
      $templateCache = _$templateCache_;
    }));


  beforeEach(inject(function (_$httpBackend_, _$compile_, _$rootScope_) {



    $httpBackend = _$httpBackend_;
    $compile = _$compile_;
    $rootScope = _$rootScope_;
    

    $scope = $rootScope.$new();
    element = angular.element('<editIngredientForm></editIngredientForm>');
    element = $compile(element)($scope);
    $scope.$digest();

    links = element.find('a');

  }));

  afterEach(function () {
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  

});
