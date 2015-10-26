// (function () {
//   'use strict';
//   angular.module('app', ['angular-jwt'])
//     .config(function Config($httpProvider, jwtInterceptorProvider) {
//       jwtInterceptorProvider.tokenGetter = ['jwtHelper', '$http', function (jwtHelper, $http) {
//         var idToken = localStorage.getItem('id_token');
//         var refreshToken = localStorage.getItem('refresh_token');
//         if (jwtHelper.isTokenExpired(idToken)) {
//           // This is a promise of a JWT id_token
//           return $http({
//             url: '/delegation',
//             // This makes it so that this request doesn't send the JWT
//             skipAuthorization: true,
//             method: 'POST',
//             data: {
//               grant_type: 'refresh_token',
//               refresh_token: refreshToken
//             }
//           }).then(function (response) {
//             var id_token = response.data.id_token;
//             localStorage.setItem('id_token', id_token);
//             return id_token;
//           });
//         } else {
//           return idToken;
//         }
//       }];
//       $httpProvider.interceptors.push('jwtInterceptor');
//     });
// }());
