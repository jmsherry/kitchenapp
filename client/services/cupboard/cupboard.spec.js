'use strict';

describe('Service: Cupboard', function() {

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
        userMock,
        //initSpy,
        //authRequestHandler,
        Cupboard,
        element,
        $scope;


    beforeEach(inject(function(_$templateCache_, _$httpBackend_, _$rootScope_, _Auth_, _Cupboard_) {
        $templateCache = _$templateCache_;
        $httpBackend = _$httpBackend_;
        $rootScope = _$rootScope_;
        Auth = _Auth_;
        Cupboard = _Cupboard_;

        userMock = {
          _id: "55c6f7b1253d754d387d270c",
          cupboard: [{_id: '1'}, {_id: '2'}, {_id: '3'}]
        };

        spyOn(Auth, "getUser").and.returnValue(userMock);

        $httpBackend.expectGET('/api/users/me').respond(userMock);
        $httpBackend.expectGET('/api/ingredients').respond([]);
        $httpBackend.expectGET('/api/users/cupboard').respond(userMock.cupboard);
        // authRequestHandler = $httpBackend.when('GET', '/api/user')
        //                     .respond({userId: 'userX'}, {'A-Token': 'xxx'});
    }));


    afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });



    it('is a registered service', function() {
      $httpBackend.flush();
        expect(Cupboard).not.toBeUndefined();
    });


    it('is has an \'init\' method', function() {
      $httpBackend.flush();
        expect(Cupboard.init).not.toBeUndefined();
    });

    describe('\'init\' method', function() {

      it('calls the Auth service', function() {
        $httpBackend.flush();
        expect(Auth.getUser).toHaveBeenCalled();
      });

      it('populates the _cupboard array with the user\'s cupboard', function() {
        $httpBackend.flush();
        expect(Cupboard.getCupboard()).toBe(userMock.cupboard);
      });

    });


    it('is has a \'get\' method', function() {
      $httpBackend.flush();
        expect(Cupboard.get).not.toBeUndefined();
    });

    describe('\'get\' method', function() {
      it('returns the user\'s cupboard', function(){
        $httpBackend.flush();
        expect(Cupboard.get()).toBe(userMock.cupboard);
      });
    });

    it('is has a \'add\' method', function() {
      $httpBackend.flush();
        expect(Cupboard.add).not.toBeUndefined();
    });

    describe('\'add\' method', function(){

      beforeEach(inject(function() {
        spyOn(Cupboard, "add").and.callThrough();
      }));


      it('takes a parameter object and adds it to the cupboard array', function(){
        var testObj = {_id: '4'}, cupboard = Cupboard.get();
        $httpBackend.expectPOST('/api/cupboard').respond(null);

        Cupboard.add(testObj);
        $httpBackend.flush();

        expect(Cupboard.add).toHaveBeenCalledWith(testObj);
        expect(cupboard.length).toBe(4);
        expect(cupboard[3]._id).toBe('4');
      });

    });

    it('is has a \'remove\' method', function() {
      $httpBackend.flush();
        expect(Cupboard.remove).not.toBeUndefined();
    });

    describe('\'remove\' method', function(){

      beforeEach(inject(function() {
        spyOn(Cupboard, "remove").and.callThrough();
        $httpBackend.expectDELETE('/api/cupboard?_id=3').respond();
      }));


      it('takes a parameter object and removes it from the relevant array in cupboard', function(){
        var testObj = {_id: '3'}, cupboard = Cupboard.get();
        Cupboard.remove(testObj)
        expect(Cupboard.remove).toHaveBeenCalledWith(testObj);
        $httpBackend.flush();
        expect(cupboard.length).toBe(2);
        expect(cupboard.indexOf(testObj)).toBe(-1);
      });

    });

    // it('is has a \'checkIngredients\' method', function() {
    //     expect(Cupboard.checkIngredients).not.toBeUndefined();
    // });

    // describe('\'checkIngredients\' method', function(){
    //     it('which checks whether a series of ingredients are in the cupboard and returns a boolean', function(){

    //     });
    // });

    it('is has a \'process\' method', function() {
      $httpBackend.flush();
        expect(Cupboard.process).not.toBeUndefined();
    });

    describe('\'process\' method', function(){
      var idsArray = ['1', '2', '4'];
        beforeEach(function(){

        });

        it('which removes what you have', function(){
          Cupboard.process(idsArray);


        });

        // it('calls the ShoppingList service to add the missing ingredients', function(){

        // });
    });


});
