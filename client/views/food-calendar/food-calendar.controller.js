'use strict';

angular.module('kitchenapp')
  .controller('FoodCalendarCtrl', FoodCalendarCtrl);

  FoodCalendarCtrl.$inject = ['$scope', '$modal', 'Meals', 'Auth', '$log', '$q'];


  function FoodCalendarCtrl($scope, $modal, Meals, Auth, $log, $q) {

  Auth.checkAuthorised();

	var meals, completeMeals, placedMeals;

  meals = Meals.get();
  $q.when(meals, function(data){
    var mls = data.complete;
    completeMeals = _.filter(mls, 'starts_at', ''),
    placedMeals = _.reject(mls, 'starts_at', '');


  	$log.log("meals data: ", data);
    $log.log("mls", mls);
  	$log.log("completeMeals: ", completeMeals);
  	$log.log("placedMeals: ", placedMeals);

    //These variables MUST be set as a minimum for the calendar to work
    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();
    $scope.events = placedMeals;

    $scope.completeMeals = completeMeals;


    function showModal(action, event) {
      $modal.open({
        templateUrl: './views/meals/food-calendar-modal.html',
        controller: function($scope, $modalInstance) {
          $scope.$modalInstance = $modalInstance;
          $scope.action = action;
          $scope.event = event;
        }
      });
    }

    $scope.eventClicked = function() {
    	$log.log('event clicked');
      $log.log($event);
      //showModal('Clicked', event);
      $event.preventDefault();
      $event.stopPropagation();
    };

    $scope.eventEdited = function() {
      showModal('Edited', event);
    };

    $scope.eventDeleted = function() {
      showModal('Deleted', event);
    };

    // $scope.calclickalert = function(){
    // 	$log.log('day clicked');
    // 	$log.log(arguments);
    // 	showModal('Clicked', event);
    //   // $event.preventDefault();
    //   // $event.stopPropagation();
    // };

    $scope.setCalendarToToday = function() {
      $scope.calendarDay = new Date();
    };

    $scope.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();

      event[field] = !event[field];
    };

});
  }
