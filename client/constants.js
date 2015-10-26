/* global toastr:false, moment:true, d3:true, nv:true, _:true */
(function() {
    'use strict';

    // var moment = window.moment;
    // var d3 = window.d3;
    // var nv = window.nv;
    // var $ = window.$;
    // var _ = window._;


    if(!moment){
      console.warn('moment not loaded');
    }

    if(!d3){
      console.warn('d3 not loaded');
    }

    if(!nv){
      console.warn('nv not loaded');
    }

    if(!$){
      console.warn('jQuery not loaded');
    }

    if(!_){
      console.warn('Lodash not loaded');
    }

    if(!Tour){
      console.warn('Bootstrap Tour not loaded');
    }

    // Constants used by the entire app
    angular
        .module('kitchenapp')
        .constant('moment', moment)
        .constant('d3', d3)
        .constant('nv', nv)
        .constant('$', $)
        .constant('_', _)
        .constant('Tour', Tour)
        .constant('FALLBACK_LANG', 'en-gb')
        .constant('FALLBACK_LOCALE', 'en-gb')
        .constant('LANGUAGES', [
          {
            name: "English (UK)",
            code: "en-gb"
          }, {
            name: "Français (FR)",
            code: "fr"
          }, {
            name: "Deutsche (DE)",
            code: "de"
          }
        ]).constant('LOCALES', [
          {
            name: "English (UK)",
            code: "en-gb"
          }, {
            name: "Français (FR)",
            code: "fr"
          }, {
            name: "Deutsche (DE)",
            code: "de"
          }
        ]).constant('CURRENCIES', [
          {
            name: "British Pound",
            code: "en-gb",
            rate: 1
          }, {
            name: "Euro",
            code: "fr",
            rate: 1.36
          }, {
            name: "Euro",
            code: "de",
            rate: 1.36
          }
        ]);


})();
