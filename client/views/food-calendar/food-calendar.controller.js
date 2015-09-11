(function(){
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('FoodCalendarCtrl', FoodCalendarCtrl);

    FoodCalendarCtrl.$inject = ['$modal', 'Meals', 'Auth', '$log', '$q', '$', '_'];


    function FoodCalendarCtrl($modal, Meals, Auth, $log, $q, $, _) {

    Auth.checkAuthorised();

  	var meals, completeMeals, placedMeals, vm = this;

    meals = Meals.get();
    $q.when(meals, function(data){
      var mls = data.complete;
      completeMeals = _.filter(mls, 'starts_at', null);
      placedMeals = _.reject(mls, 'starts_at', null);


    	$log.log("meals data: ", data);
      $log.log("mls", mls);
    	$log.log("completeMeals: ", completeMeals);
    	$log.log("placedMeals: ", placedMeals);

      //These variables MUST be set as a minimum for the calendar to work
      vm.calendarView = 'week';
      vm.calendarDay = new Date();
      //vm.nowString = 'This month';

      // $scope.$watch('vm.calendarView', function(currentView) {
      //    $log.log(arguments);
      //    switch(currentView){
      //      case 'day':
      //      vm.nowString = 'Today';
      //      break;
      //      case 'week':
      //      vm.nowString = 'This Week';
      //      break;
      //      case 'month':
      //      vm.nowString = 'This month';
      //      break;
      //      case 'year':
      //      vm.nowString = 'This Year';
      //      break;
      //    }
      // });


      //vm.events = placedMeals || [];
      vm.events = [
        {
    title: 'My event title', // The title of the event
    type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
    startsAt: new Date(2015,8,28,1), // A javascript date object for when the event starts
    endsAt: new Date(2015,8,28,2), // Optional - a javascript date object for when the event ends
    editable: true, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
    deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
    draggable: true, //Allow an event to be dragged and dropped
    resizable: true, //Allow an event to be resizable
    incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
    //recursOn: 'week', // If set the event will recur on the given period. Valid values are year or month
    cssClass: 'balls' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
  }, {
title: 'My other event title', // The title of the event
type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
startsAt: new Date(2015,8,29,1), // A javascript date object for when the event starts
endsAt: new Date(2015,8,29,2), // Optional - a javascript date object for when the event ends
editable: true, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
draggable: true, //Allow an event to be dragged and dropped
resizable: true, //Allow an event to be resizable
incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
//recursOn: 'week', // If set the event will recur on the given period. Valid values are year or month
cssClass: 'balls' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
}
      ];
      vm.completeMeals = completeMeals;


      function showModal(date) {
        $log.log('showModal', arguments);
        $modal.open({
          templateUrl: '/views/modals/food-calendar-modal.html',
          controller: function modalController($modalInstance) {
            var vm = this;
            $log.log('modal controller running', arguments, placedMeals);
            vm.$modalInstance = $modalInstance;
            vm.selectedDate = date;
            vm.completeMeals = completeMeals;
            vm.placeMeal = function(meal, date){
              console.log('Placing', arguments);
              meal.starts_at = date;
              Meals.update(meal);
            };
            $log.log('modal scope', vm);
          },
          contollerAs: 'vm'
        });
      }

      function eventClicked(calendarEvent) {
      	$log.log('event clicked', event, calendarEvent);
        //showModal('Clicked', event);
        event.preventDefault();
        event.stopPropagation();
      }

      function eventEdited() {
        vm.showModal('Edited', event);
      }

      function eventDeleted() {
        vm.showModal('Deleted', event);
      }

      function timespanClick(calendarDate){
        // if($(event.target).hasClass('cal-day-past')){ return false;}
      	// $log.log('day clicked', event);
      	// $log.log(arguments);
      	// vm.showModal(calendarDate);
        // event.preventDefault();
        // event.stopPropagation();
        // return false;
      }

      function setCalendarToToday() {
        vm.calendarDay = new Date();
      }

      function drillDownClick(){
        $log.log(arguments);

        return false;
      }

      function weekdayClick(day){
        $log.log(day);
        //alert('yes!');
      }

      function addClicked(day){
        if($(event.target).hasClass('cal-day-past')){ return false;}
        $log.log('add clicked', event);
        vm.showModal(day);
        event.preventDefault();
        event.stopPropagation();
        // return false;
      }

      angular.extend(vm, {
        name: 'FoodCalendarCtrl',
        showModal: showModal,
        eventClicked: eventClicked,
        eventEdited: eventEdited,
        eventDeleted: eventDeleted,
        timespanClick: timespanClick,
        setCalendarToToday: setCalendarToToday,
        drillDownClick: drillDownClick,
        weekdayClick: weekdayClick,
        addClicked: addClicked
      });

    });
  }
}());
