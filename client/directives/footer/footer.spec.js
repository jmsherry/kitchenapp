(function() {
    'use strict';

    describe('Directive: nav-bar', function() {

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
            links,
            userMock,
            recipesToggle,
            recipesMenu,
            recipesMenuLinks,
            ingredientsToggle,
            ingredientsMenu,
            ingredientsMenuLinks,
            mobileButton;


        beforeEach(inject(function(_$templateCache_) {
            $templateCache = _$templateCache_;
        }));


        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        describe('The footer', function(){
          it('Has a copywrite symbol and the year', function(){

          });

          it('the year automatically updates', function(){

          });

          

        });

    });
}());
