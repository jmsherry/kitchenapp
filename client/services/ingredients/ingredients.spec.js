(function () {
  'use strict';

  fdescribe('Service: Ingredients', function () {

    beforeEach(module('ngMock'));
    beforeEach(module('ui.router'));
    beforeEach(module('kitchenapp', 'templates', function ($provide, $translateProvider) {

      $provide.factory('customLoader', function ($q) {
        return function () {
          var deferred = $q.defer();
          deferred.resolve({});
          return deferred.promise;
        };
      });

      $translateProvider.useLoader('customLoader');

    }));
    //beforeEach(module('kitchenapp'));
    beforeEach(module('toastr'));

    var $httpBackend,
      $q,
      $templateCache,
      $compile,
      $urlRouterProvider,
      $rootScope,
      $scope,
      ingsRequestHandler,
      Auth,
      Ingredients,
      response,
      userMock,
      toastr;

    beforeEach(inject(function (_$templateCache_, _$httpBackend_, _$rootScope_, _Auth_, _$q_) {
      $templateCache = _$templateCache_;
      $httpBackend = _$httpBackend_;
      $rootScope = _$rootScope_;
      Auth = _Auth_;
      $q = _$q_;
    }));

    beforeEach(inject(function (_Ingredients_) {
      Ingredients = _Ingredients_;
    }));

    beforeEach(inject(function (_toastr_) {
      toastr = _toastr_;
    }));

    beforeEach(function () {
      ingsRequestHandler = $httpBackend.when('GET', '/api/ingredients').respond([{
        'name': 'init'
      }]);
      userMock = {
        _id: "55c6f7b1253d754d387d270c",
        cupboard: [{
          _id: '1'
        }, {
          _id: '2'
        }, {
          _id: '3'
        }]
      };

      spyOn(Auth, "getUser").and.returnValue(userMock);

      //$httpBackend.expectGET('/languages/en-gb.json');

      //$httpBackend.expectGET('/bower_components/angular-i18n/angular-locale_en-gb.js').respond({});

    });

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('is a registered service', function () {
      $httpBackend.flush();
      expect(Ingredients).not.toBeUndefined();
    });

    describe('The \'init\' method', function () {
      it('has an \'init\' method: ', function () {
        $httpBackend.flush();
        expect(Ingredients.init).not.toBeUndefined();
      });
      it('is called on load', function () {
        var ingredients = Ingredients.get();
        $httpBackend.flush();
        $q.when(ingredients, function (data) {
          expect(data[0].name).toBe('init');
        });
      });

      // it('shows a toastr error if the server responds with an error', function(){
      // 	ingsRequestHandler.respond(500, {message: 'balls'});
      // 	spyOn(toastr, 'error').and.callThrough();
      //       $httpBackend.flush();
      // 	expect(toastr.error).toHaveBeenCalled();
      // });
    });

    describe('The \'get\' method: ', function () {
      it('has an \'get\' method', function () {
        $httpBackend.flush();
        expect(Ingredients.get).not.toBeUndefined();
      });
      it('which returns the \'_ingredients\' array', function () {
        var ingredients = Ingredients.get();
        $httpBackend.flush();
        $q.when(ingredients, function (data) {
          console.log('ingredients', data);
          expect(_.isArray(data)).toBe(true);
          expect(data.length).toBe(1);
        });
      });
    });

    describe('The \'save\' method: ', function () {
      it('has a \'save\' method', function () {
        $httpBackend.flush();
        expect(Ingredients.save).not.toBeUndefined();
      });
      it('which saves to the server then hands off to the add method onsuccess', function () {
        var testItem = {
          ingredient: {
            'name': 'test'
          }
        };
        $httpBackend.expectPOST('/api/ingredients', testItem).respond(testItem);
        spyOn(Ingredients, 'add').and.callThrough();
        Ingredients.save(testItem);
        $httpBackend.flush();
        expect(Ingredients.add).toHaveBeenCalled();
      });
    });

    describe('The \'add\' method:', function () {

      it('has an \'add\' method ', function () {
        $httpBackend.flush();
        expect(Ingredients.add).not.toBeUndefined();
      });
      it('which adds an item to the \'_ingredients\' array', function () {
        var ingredients, testItem;

        testItem = {
          ingredient: {
            'name': 'test'
          }
        };

        Ingredients.add(testItem);
        ingredients = Ingredients.get();
        $q.when(ingredients, function (data) {
          console.log(data);
          expect(data.length).toBe(2);
        });
        $httpBackend.flush();
      });
    });

  });
}());
