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
        if(collection[i]._id === id){
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

    return {
      collIndexOf: collIndexOf,
      removeFromCollection: removeFromCollection,
      updateInCollection: updateInCollection
    };

  }
}());
