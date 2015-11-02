"use strict";

var _ = require('lodash');
var bowerFiles = require('main-bower-files'); //fn that returns the main component files
var headScripts = require('./config/headScripts');
var filesToInject = require('./config/filesToInject');
var toExclude = require('./config/bowerFilesToExclude');

module.exports = function () {

  var bowerFls, bowerBodyScripts;

  bowerFls = bowerFiles();
  console.log('bowerFls', bowerFls, bowerFls.length);
  for (var i = 0; i < bowerFls.length; i += 1) {
    bowerFls = _.pull(bowerFls, toExclude[i]);
  }

  console.log('bowerFls post exclusion', bowerFls, bowerFls.length);

  bowerBodyScripts = bowerFls.filter(function (str) {
    var match = /\.(js)$/ig.test(str);
    //console.log(match, str);
    return match;
  });

  console.log('bowerBodyScripts', bowerBodyScripts, bowerBodyScripts.length);

  for (i = 0; i < headScripts.length; i += 1) {
    bowerBodyScripts = _.pull(bowerBodyScripts, headScripts[i]);
  }

  console.log('headScripts', headScripts, headScripts.length);
  console.log('bowerBodyScripts minus headScripts', bowerBodyScripts, bowerBodyScripts.length);


  return {
    headScripts: headScripts,
    testDependencies: filesToInject.testDependancies,
    bowerBodyScripts: bowerBodyScripts,
    userScripts: filesToInject.js,
    userStyles: filesToInject.css,
    getFullList: function(){
      return headScripts.concat(filesToInject.testDependancies).concat(bowerBodyScripts).concat(filesToInject.js);
    }
  };

};
