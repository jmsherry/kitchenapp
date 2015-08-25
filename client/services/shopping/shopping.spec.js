(function(){
  'use strict';

  describe('Service: Shoppinglist', function() {

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
          Recipes,
          element,
          $scope;


      beforeEach(inject(function(_$templateCache_, _$httpBackend_, _$rootScope_, _Auth_) {
          $templateCache = _$templateCache_;
          $httpBackend = _$httpBackend_;
          $rootScope = _$rootScope_;
          Auth = _Auth_;
      }));


      afterEach(function() {
          $httpBackend.verifyNoOutstandingExpectation();
          $httpBackend.verifyNoOutstandingRequest();
      });

      beforeEach(inject(function(_Recipes_) {
          Recipes = _Recipes_;
      }));

      beforeEach(inject(function() {
        spyOn(Auth, "getUser").and.returnValue({
          recipes: {pending: [{_id: '1', isComplete: false}, {_id: '2', isComplete: false}, {_id: '3', isComplete: false}],
          complete: [{_id: 5, isComplete: true}]}
        });
      }));

      it('is a registered service', function() {
          expect(Recipes).not.toBeUndefined();
      });

      describe('\'init\' method', function() {

          it('is defined', function() {
              expect(Recipes.get).not.toBeUndefined();
          });

          it('it calls to the Auth service to get the user object', function() {
              var recipes = Recipes.get();
              expect(Auth.getUser).toHaveBeenCalled();
              expect(recipes).not.toBeUndefined();
              expect(_.isObject(recipes)).toBe(true);
              expect(_.isArray(recipes.complete)).toBe(true);
              expect(_.isArray(recipes.pending)).toBe(true);
              expect(recipes.pending.length).toEqual(3);
          });

      });


      describe('\'get\' method', function() {

          it('is defined', function() {
              expect(Recipes.get).not.toBeUndefined();
          });

          it('it calls to the Auth service to get the user object', function() {
              var recipes = Recipes.get();
              expect(Auth.getUser).toHaveBeenCalled();
              expect(recipes).not.toBeUndefined();
              expect(_.isObject(recipes)).toBe(true);
              expect(_.isArray(recipes.complete)).toBe(true);
              expect(_.isArray(recipes.pending)).toBe(true);
              expect(recipes.pending.length).toEqual(3);
          });

      });

      describe('\'add\' method', function(){

        beforeEach(inject(function() {
          spyOn(Recipes, "add").and.callThrough();
        }));

        it('is defined', function() {
          expect(Recipes.add).not.toBeUndefined();
        });

        it('takes a parameter object and adds it to the array of recipes', function(){
          var testObj = {_id: 4}, recipes = Recipes.get();
          Recipes.add(testObj);
          expect(Recipes.add).toHaveBeenCalledWith(testObj);
          //console.log(recipes);
          expect(recipes.pending.length).toEqual(4);
          expect(recipes.pending[3]._id).toEqual(4);
        });

      });

      describe('\'remove\' method', function(){

        beforeEach(inject(function() {
          spyOn(Recipes, "remove").and.callThrough();
        }));

        it('is defined', function() {
          expect(Recipes.remove).not.toBeUndefined();
        });

        it('takes a parameter object and adds it to the array of recipes', function(){
          var testObj = {_id: '3', isComplete: false},
          testObjComp = {_id: '5', isComplete: true},
          recipes = Recipes.get();

          //For pending
          //console.log(recipes.pending);
          expect(recipes.pending.length).toEqual(3);
          Recipes.remove(testObj);
          expect(Recipes.remove).toHaveBeenCalledWith(testObj);
          expect(recipes.pending.length).toEqual(2);
          expect(_.findWhere(recipes.pending, testObj)).toBeUndefined();

          //For complete
          //console.log(recipes.complete);
          expect(recipes.complete.length).toEqual(1);
          Recipes.remove(testObjComp);
          expect(Recipes.remove).toHaveBeenCalledWith(testObjComp);
          expect(recipes.complete.length).toEqual(0);
          expect(_.findWhere(recipes.complete, testObj)).toBeUndefined();
        });

      });


      describe('\'updateUser\' method', function(){

        it('is defined', function() {
          expect(Recipes.updateUser).not.toBeUndefined();
        });

        it('updates the user object with new values', function(){

          spyOn(Auth, 'updateUser');

          var user = Auth.getUser(),
          testObj = {_id: '4', isComplete: false},
          testObjComp = {_id: '5', isComplete: true},
          recipes = Recipes.get();

          expect(user).not.toBeUndefined();
          expect(_.isObject(user.recipes)).toBe(true);
          expect(_.isArray(user.recipes.complete)).toBe(true);
          expect(_.isArray(user.recipes.pending)).toBe(true);
          expect(user.recipes.complete.length).toEqual(1);
          expect(user.recipes.pending.length).toEqual(3);

          Recipes.add(testObj);
          Recipes.remove(testObjComp);
          Recipes.updateUser();

          user = Auth.getUser();

          expect(Auth.updateUser).toHaveBeenCalled();

          expect(user.recipes.complete.length).toEqual(0);
          expect(user.recipes.pending.length).toEqual(4);
        });

      });


  });
}());
