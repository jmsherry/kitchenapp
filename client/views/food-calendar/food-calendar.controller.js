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
    completeMeals = _.filter(mls, 'starts_at', null),
    placedMeals = _.reject(mls, 'starts_at', null);


  	$log.log("meals data: ", data);
    $log.log("mls", mls);
  	$log.log("completeMeals: ", completeMeals);
  	$log.log("placedMeals: ", placedMeals);

    //These variables MUST be set as a minimum for the calendar to work
    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();


    $scope.events = placedMeals;
    $scope.completeMeals = completeMeals;


    $scope.showModal = function showModal(date) {
      $log.log('showModal', arguments);
      $modal.open({
        templateUrl: '/views/modals/food-calendar-modal.html',
        controller: function modalController($scope, $modalInstance) {
          $log.log('modal controller running', arguments, placedMeals);
          $scope.$modalInstance = $modalInstance;
          $scope.selectedDate = date;
          $scope.completeMeals = completeMeals;
          $scope.placeMeal = function(meal, date){
            console.log('Placing', arguments);
            meal.starts_at = date;
            Meals.update(meal);
          }
          $log.log('modal scope', $scope);
        }
      });
    }

    $scope.eventClicked = function() {
    	$log.log('event clicked', event);
      //showModal('Clicked', event);
      event.preventDefault();
      event.stopPropagation();
    };

    $scope.eventEdited = function() {
      showModal('Edited', event);
    };

    $scope.eventDeleted = function() {
      showModal('Deleted', event);
    };

    $scope.calclickalert = function(calendarDate){
    	$log.log('day clicked');
    	$log.log(calendarDate);
    	$scope.showModal(calendarDate);
      event.preventDefault();
      event.stopPropagation();
    };

    $scope.setCalendarToToday = function() {
      $scope.calendarDay = new Date();
    };

});
  }
