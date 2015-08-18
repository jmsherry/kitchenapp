'use strict';

describe('Service: Meals', function() {

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
        Meals,
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

    beforeEach(inject(function(_Meals_) {
        Meals = _Meals_;
    }));

    beforeEach(inject(function() {
      spyOn(Auth, "getUser").and.returnValue({
        meals: {pending: [{_id: '1', isComplete: false}, {_id: '2', isComplete: false}, {_id: '3', isComplete: false}],
        complete: [{_id: 5, isComplete: true}]}
      });
    }));

    it('is a registered service', function() {
        expect(Meals).not.toBeUndefined();
    });


    describe('\'get\' method', function() {

        it('is defined', function() {
            expect(Meals.get).not.toBeUndefined();
        });

        it('it calls to the Auth service to get the user object', function() {
            var meals = Meals.get();
            expect(Auth.getUser).toHaveBeenCalled();
            expect(meals).not.toBeUndefined();
            expect(_.isObject(meals)).toBe(true);
            expect(_.isArray(meals.complete)).toBe(true);
            expect(_.isArray(meals.pending)).toBe(true);
            expect(meals.pending.length).toEqual(3);
        });

    });

    describe('\'add\' method', function(){

      beforeEach(inject(function() {
        spyOn(Meals, "add").and.callThrough();
      }));

      it('is defined', function() {
        expect(Meals.add).not.toBeUndefined();
      });

      it('takes a parameter object and adds it to the array of meals', function(){
        var testObj = {_id: 4}, meals = Meals.get();
        Meals.add(testObj);
        expect(Meals.add).toHaveBeenCalledWith(testObj);
        //console.log(meals);
        expect(meals.pending.length).toEqual(4);
        expect(meals.pending[3]._id).toEqual(4);
      });

    });

    describe('\'remove\' method', function(){

      beforeEach(inject(function() {
        spyOn(Meals, "remove").and.callThrough();
      }));

      it('is defined', function() {
        expect(Meals.remove).not.toBeUndefined();
      });

      it('takes a parameter object and adds it to the array of meals', function(){
        var testObj = {_id: '3', isComplete: false},
        testObjComp = {_id: '5', isComplete: true},
        meals = Meals.get();

        //For pending
        //console.log(meals.pending);
        expect(meals.pending.length).toEqual(3);
        Meals.remove(testObj);
        expect(Meals.remove).toHaveBeenCalledWith(testObj);
        expect(meals.pending.length).toEqual(2);
        expect(_.findWhere(meals.pending, testObj)).toBeUndefined();

        //For complete
        //console.log(meals.complete);
        expect(meals.complete.length).toEqual(1);
        Meals.remove(testObjComp);
        expect(Meals.remove).toHaveBeenCalledWith(testObjComp);
        expect(meals.complete.length).toEqual(0);
        expect(_.findWhere(meals.complete, testObj)).toBeUndefined();
      });

    });


    describe('\'updateUser\' method', function(){

      it('is defined', function() {
        expect(Meals.updateUser).not.toBeUndefined();
      });

      it('updates the user object with new values', function(){

        spyOn(Auth, 'updateUser');

        var user = Auth.getUser(),
        testObj = {_id: '4', isComplete: false},
        testObjComp = {_id: '5', isComplete: true},
        meals = Meals.get();

        expect(user).not.toBeUndefined();
        expect(_.isObject(user.meals)).toBe(true);
        expect(_.isArray(user.meals.complete)).toBe(true);
        expect(_.isArray(user.meals.pending)).toBe(true);
        expect(user.meals.complete.length).toEqual(1);
        expect(user.meals.pending.length).toEqual(3);

        Meals.add(testObj);
        Meals.remove(testObjComp);
        Meals.updateUser();

        user = Auth.getUser();

        expect(Auth.updateUser).toHaveBeenCalled();

        expect(user.meals.complete.length).toEqual(0);
        expect(user.meals.pending.length).toEqual(4);
      });

    });


});
