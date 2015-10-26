(function () {
  'use strict';

  var config = require('./config/environment');

  module.exports = function (app) {

    function paramFix(req, res, next) {
      req._params = req.params;
      next();
    }

    function handleExpired(req, res) {
      res.sendStatus(401);
    }

    function notFound(req, res) {
      res.status(404).end();
    }

    // API
    app.use('/api/users', require('./api/user'));
    app.use('/api/ingredients', require('./api/ingredient'));
    app.use('/api/recipes', require('./api/recipe'));
    app.use('/api/users/:userid/meals', paramFix, require('./api/meal'));
    app.use('/api/users/:userid/shopping', paramFix, require('./api/shopping'));
    app.use('/api/users/:userid/cupboard', paramFix, require('./api/cupboard'));
    app.use('/api/users/:userid/purchases', paramFix, require('./api/transaction'));

    //Accidental Routes
    app.use('/api/users/meals', notFound);
    app.use('/api/users/shopping', notFound);
    app.use('/api/users/cupboard', notFound);
    app.use('/api/users/purchases', notFound);

    //Email service
    app.use('/api/email', paramFix, require('./api/email'));

    // Auth
    app.use('/auth', require('./auth'));

    app.route('/:url(api|app|bower_components|assets)/*')
      .get(notFound);

    //load testing token url
    app.route('/loaderio-133d97e6bd54d83cb2c846d835a829b4/').get(function (req, res) {
      console.log('in token route');
      res.sendFile(__dirname + '/loader.io.txt');
    });

    app.route('/*')
      .get(function (req, res) {
        res.sendFile(
          app.get('appPath') + '/index.html', {
            root: config.root
          }
        );
      });

  };
}());
