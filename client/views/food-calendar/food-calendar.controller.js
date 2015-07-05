'use strict';

angular.module('kitchenapp')
  .controller('FoodCalendarCtrl', FoodCalendarCtrl);

  FoodCalendarCtrl.$inject = ['$scope', '$modal', 'Meals', 'Auth'];


  function FoodCalendarCtrl($scope, $modal, Meals, Auth) {

  Auth.checkAuthorised();

	var meals = Meals.get(),
	completeMeals = _.filter(meals, 'starts_at', ''),
	placedMeals = _.reject(meals, 'starts_at', '');

	console.log("meals: ", meals);
	console.log("completeMeals: ", completeMeals);
	console.log("placedMeals: ", placedMeals);

    //These variables MUST be set as a minimum for the calendar to work
    $scope.calendarView = 'month';
    $scope.calendarDay = new Date();
    $scope.events = placedMeals;

    $scope.completeMeals = completeMeals;


    function showModal(action, event) {
      $modal.open({
        templateUrl: 'views/meals/food-calendar-modal.html',
        controller: function($scope, $modalInstance) {
          $scope.$modalInstance = $modalInstance;
          $scope.action = action;
          $scope.event = event;
        }
      });
    }

    $scope.eventClicked = function() {
    	console.log('event clicked');
      showModal('Clicked', event);
      $event.preventDefault();
      $event.stopPropagation();
    };

    $scope.eventEdited = function() {
      showModal('Edited', event);
    };

    $scope.eventDeleted = function() {
      showModal('Deleted', event);
    };

    $scope.calclickalert = function(){
    	console.log('day clicked');
    	console.log(arguments);
    	showModal('Clicked', event);
      // $event.preventDefault();
      // $event.stopPropagation();
    };

    $scope.setCalendarToToday = function() {
      $scope.calendarDay = new Date();
    };

    $scope.toggle = function($event, field, event) {
      $event.preventDefault();
      $event.stopPropagation();

      event[field] = !event[field];
    };
console.log($scope);

  }
