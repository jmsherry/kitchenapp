(function(){
  'use strict';

  angular.module('kitchenapp.services')
    .service('Email', Email);

    Email.$inject = ['$q', '$http'];

    function Email($q, $http) {


      /**
       * sendEmail
       *
       * @param message
       * @returns {promise}
       */
      this.sendEmail = function (email, user) {
        var deferred = $q.defer();
        if(email.cc_self){
          email.cc = user.email;
        }
        $http.post('/api/email', {email: email})
          .then(function (res) {
            deferred.resolve(res);
          }, function (err) {
            deferred.reject(err.data);
          });
        return deferred.promise;
      };

    }

}());
