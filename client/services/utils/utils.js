(function () {
  'use strict';

  angular.module('kitchenapp.services')
    .factory('Utils', Utils);

  Utils.$inject = ['$log', '$', '_'];

  function Utils($log, _, $) {

    function collIndexOf(collection, item){
      var i, len = collection.length, idx = undefined, id;

      id = item._id || item;

      for(i=0; i<len; i+=1){
        if(collection[i]._id || collection[i] === id){
          idx = i;
          break;
        }
      }
      if(!idx && idx !== 0){
        throw new Error('Item not in collection');
      }
      return idx;
    }

    function removeFromCollection(collection, item){

    }

    function updateInCollection(collection, item){

    }

    function depopulate(o) {
    var results = [];

    function properties(obj) {
      var props, i;
      if (!obj) {
        throw new Error('No object provided to depopulate')
      }
      // if (typeof obj !== 'object' && typeof obj !== 'function') {
      //   return properties(obj.constructor.prototype);
      // }
      props = Object.getOwnPropertyNames(obj);
      i = props.length;
      while (i--) {
        if (!~results.indexOf(props[i])) {
          results.push(props[i]);
        }
      }
      return properties(Object.getPrototypeOf(obj));
    }
    return properties(o);
    }

    return {
      collIndexOf: collIndexOf,
      removeFromCollection: removeFromCollection,
      updateInCollection: updateInCollection
    };

  }
}());
