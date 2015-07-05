'use strict';

describe('Service: Recipes', function() {

		beforeEach(module('ngMock'));
		beforeEach(module('ui.router'));
		beforeEach(module('kitchenapp', 'templates'));
		beforeEach(module('toastr'));


		var $httpBackend,
				$q,
				$templateCache,
				$compile,
				$urlRouterProvider,
				$rootScope,
				$scope,
				recsRequestHandler,
				Auth,
				Recipes,
				response,
				toastr;


		beforeEach(inject(function(_$templateCache_, _$httpBackend_, _$rootScope_, _Auth_, _$q_) {
				$templateCache = _$templateCache_;
				$httpBackend = _$httpBackend_;
				$rootScope = _$rootScope_;
				Auth = _Auth_;
				$q = _$q_
		}));


		beforeEach(inject(function(_Recipes_) {
				Recipes = _Recipes_;
		}));

		beforeEach(inject(function(_toastr_) {
				toastr = _toastr_;
		}));

		beforeEach(function() {
			recsRequestHandler = $httpBackend.when('GET', '/api/recipes').respond([{'name': 'init'}]);
		});

		afterEach(function() {
				$httpBackend.verifyNoOutstandingExpectation();
				$httpBackend.verifyNoOutstandingRequest();
		});

		it('is a registered service', function() {
				$httpBackend.flush();
				expect(Recipes).not.toBeUndefined();
		});



		it('has an \'init\' method: ', function() {
				$httpBackend.flush();
				expect(Recipes.init).not.toBeUndefined();
		});



		describe('The \'init\' method', function(){

				it('is called on load', function(){
						var recipes = Recipes.get();
						$httpBackend.flush();
						$q.when(recipes, function(data){
								expect(data[0].name).toBe('init');
						});
				});


			it('shows a toastr error if the server responds with an error', function(){
				recsRequestHandler.respond(500, {message: 'balls'});
				spyOn(toastr, 'error').and.callThrough();
				$httpBackend.flush();
				expect(toastr.error).toHaveBeenCalled();
			});
		});



		it('has an \'get\' method', function() {
				$httpBackend.flush();
				expect(Recipes.get).not.toBeUndefined();
		});

		describe('The \'get\' method: ', function(){
			it('returns the \'_recipes\' array', function(){
				var recipes = Recipes.get();
						console.log(recipes);
						$httpBackend.flush();
						$q.when(recipes, function(data){
						expect(_.isArray(data)).toBe(true);
						expect(data.length).toBe(1);
						});
			});
		});

		it('has a \'save\' method', function(){
			$httpBackend.flush();
			expect(Recipes.save).not.toBeUndefined();
		});

		describe('The \'save\' method: ', function(){
			it('saves to the server then hands off to the add method onsuccess', function(){
				var testItem = {recipe: {'name': 'test'}};
				$httpBackend.expectPOST('/api/recipes', testItem).respond(null);
				spyOn(Recipes, 'add').and.callThrough();
				Recipes.save(testItem);
				$httpBackend.flush();
				expect(Recipes.add).toHaveBeenCalled();
			});
		});


		it('has an \'add\' method: ', function() {
				$httpBackend.flush();
				expect(Recipes.add).not.toBeUndefined();
		});

		describe('The \'add\' method', function(){
			it('adds an item to the \'_recipes\' array', function(){
						var testItem = {recipe: {'name': 'test'}}, recipes = Recipes.get();

						Recipes.add(testItem);
						$q.when(recipes, function(data){
								console.log(data);
								expect(data.length).toBe(2);
						});
						$httpBackend.flush();
				});
		});

});
