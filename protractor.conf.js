/* globals browser */
"use strict";

exports.config = { // jshint ignore:line

  // The version is susceptible to change
  seleniumServerJar: '/Users/jamessherry/sites/ka2/node_modules/gulp-protractor/node_modules/protractor/selenium/selenium-server-standalone-2.47.1.jar',
  // chromeDriver: './node_modules/gulp-protractor/node_modules/protractor/selenium/chromedriver',

  baseUrl: 'http://localhost:9000',

  capabilities: {
    browserName: 'chrome'
    // chromeOptions: {
    //    binary: '/usr/bin/google-chrome-stable'
    // }
  },


  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 30000
  },
  onPrepare: function() {
    browser.manage().window().setSize(1600, 1000);
  }

};
