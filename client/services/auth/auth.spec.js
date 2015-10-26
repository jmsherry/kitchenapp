(function(){
  'use strict';

  describe('Service: Auth', function () {

    beforeEach(module('kitchenapp'));

    var Auth,
      $httpBackend,
      $cookies;

    beforeEach(inject(function (_Auth_, _$httpBackend_, _$cookies_) {
      Auth = _Auth_;
      $httpBackend = _$httpBackend_;
      $cookies = _$cookies_;
      $cookies.remove('token');
    }));

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should log user', function () {
      expect(Auth.isLoggedIn()).toBe(false);
      Auth.login({ email: 'test@test.com', password: 'test' });
      $httpBackend.expectPOST('/auth/local')
        .respond({ token: 'abcde', user: { email: 'test@test.com' } });
      $httpBackend.flush();
      expect($cookies.get('token')).toBe('abcde');
      expect(Auth.getUser().email).toBe('test@test.com');
      expect(Auth.isLoggedIn()).toBe(true);
    });

  });
}());
