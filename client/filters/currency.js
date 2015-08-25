(function(){
  angular.module('kitchenapp').filter('currencyFilter', function () {
  return function (value) {
      return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
    };
  });
}());
//An example of a filter
