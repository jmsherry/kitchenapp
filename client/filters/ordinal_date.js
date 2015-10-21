'use strict';

angular.module('kitchenapp')
.filter('ordinal_date', ['$filter', '$log', function($filter, $log) {
  var suffixes = ["th", "st", "nd", "rd"];
  return function(input, format) {

    $log.log('in ordinal_date filter', input, format);
    var dtfilter, day, relevantDigits, suffix;

    dtfilter = $filter('date')(input, format);
    day = parseInt($filter('date')(input, 'dd'));
    relevantDigits = (day < 30) ? day % 20 : day % 30;
    suffix = (relevantDigits <= 3) ? suffixes[relevantDigits] : suffixes[0];

    return dtfilter.replace('oo', suffix);
  };
}]);
