(function(){
  'use strict';

  var config = require('./config/environment');

  module.exports = function (app) {

    function paramFix(req, res, next) {
        req._params = req.params;
        next();
    }

    // API
    app.use('/api/users', require('./api/user'));
    app.use('/api/ingredients', require('./api/ingredient'));
    app.use('/api/recipes', require('./api/recipe'));
    app.use('/api/users/:userid/meals', paramFix, require('./api/meal'));
    app.use('/api/users/:userid/shopping', paramFix, require('./api/shopping'));
    app.use('/api/users/:userid/cupboard', paramFix, require('./api/cupboard'));
    app.use('/api/users/:userid/purchases', paramFix, require('./api/transaction'));


    // Auth
    app.use('/auth', require('./auth'));

    app.route('/:url(api|app|bower_components|assets)/*')
      .get(function (req, res) {
        res.status(404).end();
      });
      
      

    app.route('/*')
      .get(function (req, res) {
        res.sendFile(
          app.get('appPath') + '/index.html',
          { root: config.root }
        );
      });
      
      //load testing token url
      app.route('/loaderio-133d97e6bd54d83cb2c846d835a829b4/').get(function(req, res){
        res.sendFile(__dirname + '/loader.io.txt').end();
      });

  };
}());
