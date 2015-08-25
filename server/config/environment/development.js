(function(){
  'use strict';

  var mongoURI;
  if(process.env.HEROKU){
    mongoURI = 'mongodb://kitchenapp2:Lich1977@ds055732.mongolab.com:55732/heroku_t1mhd097';
  } else {
    mongoURI = 'mongodb://localhost/kitchenapp-dev';
  }

  module.exports = {
    mongo: {
      uri: mongoURI
    }
  };
}());
