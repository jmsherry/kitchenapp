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



        describe('(when logged in)', function() {

            beforeEach(inject(function(_$httpBackend_, _$compile_, _$rootScope_) {

                $httpBackend = _$httpBackend_;
                $compile = _$compile_;
                $rootScope = _$rootScope_;

                spyOn($rootScope.Auth, "isLogged").and.returnValue(true);
                $scope = $rootScope.$new();
                element = angular.element('<nav-bar></nav-bar>');
                element = $compile(element)($scope);
                $scope.$digest();

                links = element.find('a');
                recipesToggle = links.filter('.dropdown-toggle').eq(0);
                recipesMenu = recipesToggle.siblings('ul');
                recipesMenuLinks = recipesMenu.find('a');

                ingredientsToggle = links.filter('.dropdown-toggle').eq(1);
                ingredientsMenu = ingredientsToggle.siblings('ul');
                ingredientsMenuLinks = ingredientsMenu.find('a');

                mobileButton = element.find('button[data-target="#bs-example-navbar-collapse-1"]');

                userMock = {
                  _id: "55c6f7b1253d754d387d270c",
                  cupboard: [{_id: '1'}, {_id: '2'}, {_id: '3'}]
                };

                $httpBackend.expectGET('/api/users/me').respond(userMock);

            }));

            it('should have a mobile button', function(){
              $httpBackend.flush();
              expect(mobileButton.length).toEqual(1);
            });

            it('\'s brand link should be titled \'KitchenApp\' and should navigate to the root address when clicked', function() {
                $httpBackend.flush();
                var titleLink = links.filter('.navbar-brand');
                expect(titleLink.length).toEqual(1);
                expect(titleLink.attr('ui-sref')).toEqual('home');
                expect(titleLink.attr('href')).toEqual('/');
                expect(titleLink.text()).toEqual('KitchenApp');
            });

            it('the next link should be a link to the food calendar view', function() {
                $httpBackend.flush();
                var foodCalendarLink = links.eq(1),
                    sref = foodCalendarLink.attr('ui-sref');
                expect(foodCalendarLink.length).toEqual(1);
                expect(sref).toEqual('food-calendar');
                expect(foodCalendarLink.text()).toEqual('Schedule Meals');
            });

            it('the next link should be a link to the meals view', function() {
                $httpBackend.flush();
                var buildMealsLink = links.eq(2),
                    sref = buildMealsLink.attr('ui-sref');
                expect(buildMealsLink.length).toEqual(1);
                expect(sref).toEqual('meals');
                expect(buildMealsLink.text()).toEqual('Build Meals');
            });

            it('the next link should be a link to the cupboard view', function() {
                $httpBackend.flush();
                var cupboardLink = links.eq(3),
                    sref = cupboardLink.attr('ui-sref');
                expect(cupboardLink.length).toEqual(1);
                expect(sref).toEqual('cupboard');
                expect(cupboardLink.text()).toEqual('My Cupboard');
            });

            it('the next link should be a link to the shop view', function() {
                $httpBackend.flush();
                var inventoryLink = links.eq(4);
                expect(inventoryLink.length).toEqual(1);
                expect(inventoryLink.attr('ui-sref')).toEqual('shop');
                expect(inventoryLink.text()).toEqual('Shop');
            });

            it('should have a dropdown link for recipes', function() {
                $httpBackend.flush();
                expect(recipesToggle.length).toEqual(1);
                expect(recipesToggle.attr('ui-sref')).toBeUndefined();
                expect(recipesToggle.attr('href')).toEqual('#');
                expect(recipesToggle.text()).toEqual('Recipes');
            });

            it('which should have a menu item for \'List Recipes\'', function() {
                $httpBackend.flush();
                var listRecipesLink = recipesMenuLinks.eq(0);
                expect(listRecipesLink.length).toEqual(1);
                expect(listRecipesLink.attr('ui-sref')).toEqual('recipes');
                expect(listRecipesLink.attr('href')).toEqual('/recipes');
                expect(listRecipesLink.text()).toEqual('List Recipes');
            });

            it('should have a menu item for \'Add Recipes\'', function() {
                $httpBackend.flush();
                var addRecipesLink = recipesMenuLinks.eq(1);
                expect(addRecipesLink.length).toEqual(1);
                expect(addRecipesLink.attr('ui-sref')).toEqual('addRecipe');
                expect(addRecipesLink.attr('href')).toEqual('/recipe/add');
                expect(addRecipesLink.text()).toEqual('Add Recipe');
            });

            it('should have a dropdown link for ingredients', function() {
                $httpBackend.flush();
                expect(ingredientsToggle.length).toEqual(1);
                expect(ingredientsToggle.attr('ui-sref')).toBeUndefined();
                expect(ingredientsToggle.attr('href')).toEqual('#');
                expect(ingredientsToggle.text()).toEqual('Ingredients');
            });

            it('which should have a menu item for \'List Ingredients\'', function() {
                $httpBackend.flush();
                var listIngredientsLink = ingredientsMenuLinks.eq(0);
                expect(listIngredientsLink.length).toEqual(1);
                expect(listIngredientsLink.attr('ui-sref')).toEqual('ingredients');
                expect(listIngredientsLink.attr('href')).toEqual('/ingredients');
                expect(listIngredientsLink.text()).toEqual('List Ingredients');
            });

            it('should have a menu item for \'Add Ingredients\'', function() {
                $httpBackend.flush();
                var addIngredientsLink = ingredientsMenuLinks.eq(1);
                expect(addIngredientsLink.length).toEqual(1);
                expect(addIngredientsLink.attr('ui-sref')).toEqual('addIngredient');
                expect(addIngredientsLink.attr('href')).toEqual('/ingredient/add');
                expect(addIngredientsLink.text()).toEqual('Add Ingredient');
            });

            it('it should have no links other than these 12 links', function(){
              expect(links.length).toEqual(13);
            });

        });

        describe('when logged out', function() {

            beforeEach(inject(function(_$httpBackend_, _$compile_, _$rootScope_) {

                $httpBackend = _$httpBackend_;
                $compile = _$compile_;
                $rootScope = _$rootScope_;

                spyOn($rootScope.Auth, "isLogged").and.returnValue(false);
                $scope = $rootScope.$new();
                element = angular.element('<nav-bar></nav-bar>');
                element = $compile(element)($scope);
                $scope.$digest();

                links = element.find('a');
                recipesToggle = links.filter('.dropdown-toggle').eq(0);
                recipesMenu = recipesToggle.siblings('ul');
                recipesMenuLinks = recipesMenu.find('a');

                ingredientsToggle = links.filter('.dropdown-toggle').eq(1);
                ingredientsMenu = ingredientsToggle.siblings('ul');
                ingredientsMenuLinks = ingredientsMenu.find('a');

                mobileButton = element.find('button[data-target="#bs-example-navbar-collapse-1"]');

            }));

            it('should have a mobile button', function(){
              expect(mobileButton.length).toEqual(1);
            });

            it('\'s brand link should be titled \'KitchenApp\' and should navigate to the root address when clicked', function() {
                var titleLink = links.filter('.navbar-brand');
                expect(titleLink.length).toEqual(1);
                expect(titleLink.attr('ui-sref')).toEqual('home');
                expect(titleLink.attr('href')).toEqual('/');
                expect(titleLink.text()).toEqual('KitchenApp');
            });

            it('should have a dropdown link for recipes', function() {
                expect(recipesToggle.length).toEqual(1);
                expect(recipesToggle.attr('ui-sref')).toBeUndefined();
                expect(recipesToggle.attr('href')).toEqual('#');
                expect(recipesToggle.text()).toEqual('Recipes');
            });

            it('which should have a menu item for \'List Recipes\'', function() {
                var listRecipesLink = recipesMenuLinks.eq(0);
                expect(listRecipesLink.length).toEqual(1);
                expect(listRecipesLink.attr('ui-sref')).toEqual('recipes');
                expect(listRecipesLink.attr('href')).toEqual('/recipes');
                expect(listRecipesLink.text()).toEqual('List Recipes');
            });

            it('should have a dropdown link for ingredients', function() {
                expect(ingredientsToggle.length).toEqual(1);
                expect(ingredientsToggle.attr('ui-sref')).toBeUndefined();
                expect(ingredientsToggle.attr('href')).toEqual('#');
                expect(ingredientsToggle.text()).toEqual('Ingredients');
            });

            it('which should have a menu item for \'List Ingredients\'', function() {
                var listIngredientsLink = ingredientsMenuLinks.eq(0);
                expect(listIngredientsLink.length).toEqual(1);
                expect(listIngredientsLink.attr('ui-sref')).toEqual('ingredients');
                expect(listIngredientsLink.attr('href')).toEqual('/ingredients');
                expect(listIngredientsLink.text()).toEqual('List Ingredients');
            });

            it('it should have no links other than these 6 links', function(){
              expect(links.length).toEqual(7);
            });

        });

        describe(': The auth menu', function() {

            var authMenu, authMenuLinks;


            describe('(when logged out)', function() {

                beforeEach(inject(function(_$httpBackend_, _$compile_, _$rootScope_) {

                    $httpBackend = _$httpBackend_;
                    $compile = _$compile_;
                    $rootScope = _$rootScope_;

                    spyOn($rootScope.Auth, "isLogged").and.returnValue(false);
                    $scope = $rootScope.$new();
                    element = angular.element('<nav-bar></nav-bar>');
                    element = $compile(element)($scope);
                    $scope.$digest();

                    links = element.find('a');
                    authMenu = element.find('#auth-menu');
                    authMenuLinks = authMenu.find('a');

                }));


                it('has called the Auth service and received a logged out state', function() {
                    expect($rootScope.Auth.isLogged).toHaveBeenCalled();
                    expect($rootScope.Auth.isLogged()).toBe(false);

                });

                it('has a sign up Link', function() {
                    var signUpLink = authMenuLinks.filter('[ui-sref="signup"]');
                    expect(signUpLink.length).toEqual(1);
                });

                it('has a login Link', function() {
                    var loginLink = authMenuLinks.filter('[ui-sref="login"]');
                    expect(loginLink.length).toEqual(1);
                });

                it('has no profile Link', function() {
                    var profileLink = authMenuLinks.filter('[ui-sref="profile"]');
                    expect(profileLink.length).toEqual(0);
                });

                it('has no logout Link', function() {
                    var logoutLink = authMenuLinks.filter('[ng-click="Auth.logout()"]');
                    expect(logoutLink.length).toEqual(0);
                });

            });

            describe('(when logged in)', function() {

                beforeEach(inject(function(_$httpBackend_, _$compile_, _$rootScope_) {

                    $httpBackend = _$httpBackend_;
                    $compile = _$compile_;
                    $rootScope = _$rootScope_;

                    spyOn($rootScope.Auth, "isLogged").and.returnValue(true);
                    $scope = $rootScope.$new();
                    element = angular.element('<nav-bar></nav-bar>');
                    element = $compile(element)($scope);
                    $scope.$digest();

                    links = element.find('a');
                    authMenu = element.find('#auth-menu');
                    authMenuLinks = authMenu.find('a');

                }));

                it('has called the Auth service and received a logged in state', function() {
                    expect($rootScope.Auth.isLogged).toHaveBeenCalled();
                    expect($rootScope.Auth.isLogged()).toBe(true);
                   // console.log(element);
                });

                it('has a profile Link', function() {
                    var profileLink = authMenuLinks.filter('[ui-sref="profile"]');
                    expect(profileLink.length).toEqual(1);
                });

                it('has a logout Link', function() {
                    var logoutLink = authMenuLinks.filter('[ng-click="Auth.logout()"]');
                    expect(logoutLink.length).toEqual(1);
                });

                it('has no sign up Link', function() {
                    var signUpLink = authMenuLinks.filter('[ui-sref="signup"]');
                    expect(signUpLink.length).toEqual(0);
                });

                it('has no login Link', function() {
                    var loginLink = authMenuLinks.filter('[ui-sref="login"]');
                    expect(loginLink.length).toEqual(0);
                });

            });


        });

    });
}());
