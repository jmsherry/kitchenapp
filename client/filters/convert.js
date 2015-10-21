//(function(){
  'use strict';

  angular.module('kitchenapp.filters')
  .filter('convert', ['CURRENCIES', 'tmhDynamicLocale', '_', function (CURRENCIES, tmhDynamicLocale, _) {
    return function (value) {
      var currentLocale, currency, conversionRate;
      currentLocale = tmhDynamicLocale.get();
      currency = _.find(CURRENCIES, {code: currentLocale});
      conversionRate = currency.rate;
      return value * conversionRate;
    };
  }]);

//}());
