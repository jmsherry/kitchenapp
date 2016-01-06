(function () {
  'use strict';

  var config = require('./config/environment');

  module.exports = function (app) {

    function paramFix(req, res, next) {
      req._params = req.params;
      next();
    }

    function handleExpired(req, res) {
      console.log('sessionExpired');
      res.sendStatus(401);
    }

    function notFound(req, res) {
      console.log('notFound');
      res.sendStatus(404);
    }

    function markAsHandled(req, res, next) {
      req.unhandled = false;
      console.log('marking as handled: ', res.unhandled, next);
      next();
    }

    app.use(function (req, res, next) {
      req.unhandled = true;
      console.log('marking as unhandled: ', res.unhandled, next);
      next();
    });

    // API
    app.use('/api/users', markAsHandled, require('./api/user'));
    app.use('/api/ingredients', markAsHandled, require('./api/ingredient'));
    app.use('/api/recipes', markAsHandled, require('./api/recipe'));
    app.use('/api/users/:userid/meals', markAsHandled, paramFix, require('./api/meal'));
    app.use('/api/users/:userid/shopping', markAsHandled, paramFix, require('./api/shopping'));
    app.use('/api/users/:userid/cupboard', markAsHandled, paramFix, require('./api/cupboard'));
    app.use('/api/users/:userid/purchases', markAsHandled, paramFix, require('./api/transaction'));

    //Accidental Routes
    // app.use('/api/users/meals', notFound);
    // app.use('/api/users/shopping', notFound);
    // app.use('/api/users/cupboard', notFound);
    // app.use('/api/users/purchases', notFound);

    //Email service
    app.use('/api/email',markAsHandled, paramFix, require('./api/email'));

    // Auth
    app.use('/auth', markAsHandled, require('./auth'));

    app.route('/:url(api|app|bower_components|assets)/**/*')
      .get(notFound);

    //load testing token url
    app.route('/loaderio-133d97e6bd54d83cb2c846d835a829b4/').get(function (req, res) {
      console.log('in token route');
      res.sendFile(__dirname + '/loader.io.txt');
    });

    app.route('/chocolates').get(function(req, res){
      res.json([{
        name: 'mars bar',
        cost: 0.6,
        imageURL: 'http://img.tesco.com/Groceries/pi/476/5000159470476/IDShot_540x540.jpg',
        thumbnailURL: 'http://img.tesco.com/Groceries/pi/476/5000159470476/IDShot_110x110.jpg'
      }, {
        name: 'twix',
        cost: 0.7,
        imageURL: 'http://img.tesco.com/Groceries/pi/228/5000159459228/IDShot_540x540.jpg',
        thumbnailURL: 'http://img.tesco.com/Groceries/pi/228/5000159459228/IDShot_110x110.jpg'
      }, {
        name: 'Galaxy Caramel (135g)',
        cost: 1.5,
        imageURL: 'http://img.tesco.com/Groceries/pi/710/5900951027710/IDShot_540x540.jpg',
        thumbnailURL: 'http://img.tesco.com/Groceries/pi/710/5900951027710/IDShot_110x110.jpg'
      }]);
    });

    app.route('/chocolates/new').get(function(req, res){
      res.json([{
        name: 'mars bar',
        cost: 0.6,
        imageURL: 'http://img.tesco.com/Groceries/pi/476/5000159470476/IDShot_540x540.jpg',
        thumbnailURL: 'http://img.tesco.com/Groceries/pi/476/5000159470476/IDShot_110x110.jpg'
      }, {
        name: 'twix',
        cost: 0.7,
        imageURL: 'http://img.tesco.com/Groceries/pi/228/5000159459228/IDShot_540x540.jpg',
        thumbnailURL: 'http://img.tesco.com/Groceries/pi/228/5000159459228/IDShot_110x110.jpg'
      }, {
        name: 'snickers',
        cost: 0.7
        imageURL: 'http://img.tesco.com/Groceries/pi/476/5000159470476/IDShot_540x540.jpg',
        thumbnailURL: 'http://img.tesco.com/Groceries/pi/476/5000159470476/IDShot_110x110.jpg'
      }]);
    });


    app.route('/*')
      .get(function (req, res) {
        console.log('in', req.unhandled, req.xhr);
        if (req.unhandled && req.xhr) {
          notFound(req, res);
        } else {
          res.sendFile(
            app.get('appPath') + '/index.html', {
              root: config.root
            }
          );
        }
      });

  };
}());
