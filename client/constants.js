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
        .constant('Tour', Tour);


})();
