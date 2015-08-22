'use strict';

module.exports = function(){
  var mongoURI;
  if(process.env.HEROKU){
    mongoURI = 'mongodb://kitchenapp2:Lich1977@ds055732.mongolab.com:55732/heroku_t1mhd097';
  } else {
    mongoURI = 'mongodb://localhost/kitchenapp';
  }
  return {
    ip: process.env.IP || undefined,
    mongo: {
      uri: mongoURI
    }
  };
};
