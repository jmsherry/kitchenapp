// var passport = require('passport'),
//     GoogleStrategy = require('./google_oauth2'),
//     config = require('../config');
//
// passport.use('google-imap', new GoogleStrategy({
//   clientID: config('google.api.client_id'),
//   clientSecret: config('google.api.client_secret')
// }, function (accessToken, refreshToken, profile, done) {
//   console.log(accessToken, refreshToken, profile);
//   done(null, {
//     access_token: accessToken,
//     refresh_token: refreshToken,
//     profile: profile
//   });
// }));
//
// exports.mount = function (app) {
//   app.get('/add-imap/:address?', function (req, res, next) {
//     passport.authorize('google-imap', {
//         scope: [
//           'https://mail.google.com/',
//           'https://www.googleapis.com/auth/userinfo.email'
//         ],
//         callbackURL: config('web.vhost') + '/add-imap',
//         accessType: 'offline',
//         approvalPrompt: 'force',
//         loginHint: req.params.address
//       })(req, res, function () {
//         res.send(req.user);
//       });
//   });
// };
