(function () {
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('FoodCalendarCtrl', FoodCalendarCtrl);

  FoodCalendarCtrl.$inject = ['$modal', 'Meals', 'Auth', '$log', '$q', '$', '_', 'moment', 'Utils'];

  function FoodCalendarCtrl($modal, Meals, Auth, $log, $q, $, _, moment, Utils) {

    Auth.checkAuthorised();

    var meals, completeMeals, placedMeals, vm = this;

    function wrap(element, index, array){

      var eventWrapper = Object.create(element);
      eventWrapper = angular.extend(eventWrapper, {
        title: element.name, // The title of the event
        type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
        startsAt: moment(element.startsAt).toDate(), // A javascript date object for when the event starts
        endsAt: moment(element.startsAt).add(1, 'h').toDate(), // Optional - a javascript date object for when the event ends
        editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
        deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
        draggable: true, //Allow an event to be dragged and dropped
        resizable: true, //Allow an event to be resizable
        incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
        //recursOn: 'week', // If set the event will recur on the given period. Valid values are year or month
        cssClass: 'balls' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
      });

      return eventWrapper;
    }

    meals = Meals.get();
    $q.when(meals, function (data) {
      var mls = data.complete;
      completeMeals = _.filter(mls, 'startsAt', null);
      placedMeals = _.reject(mls, 'startsAt', null);
      vm.events = placedMeals.map(wrap);

      $log.log("meals data: ", data);
      $log.log("mls", mls);
      $log.log("completeMeals: ", completeMeals);
      $log.log("placedMeals: ", placedMeals);

      vm.canAdd = completeMeals.length > 0 ? true : false;


      //These variables MUST be set as a minimum for the calendar to work
      vm.calendarView = 'month';
      vm.calendarDay = new Date();
      //vm.nowString = 'This month';

      //vm.events = placedMeals || [];

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
      // vm.events = [{
      //   title: 'My event title', // The title of the event
      //   type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
      //   startsAt: new Date(2015, 8, 28, 1), // A javascript date object for when the event starts
      //   endsAt: new Date(2015, 8, 28, 2), // Optional - a javascript date object for when the event ends
      //   editable: true, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
      //   deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
      //   draggable: true, //Allow an event to be dragged and dropped
      //   resizable: true, //Allow an event to be resizable
      //   incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
      //   //recursOn: 'week', // If set the event will recur on the given period. Valid values are year or month
      //   cssClass: 'balls' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
      // }, {
      //   title: 'My other event title', // The title of the event
      //   type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
      //   startsAt: new Date(2015, 8, 29, 1), // A javascript date object for when the event starts
      //   endsAt: new Date(2015, 8, 29, 2), // Optional - a javascript date object for when the event ends
      //   editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
      //   deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
      //   draggable: true, //Allow an event to be dragged and dropped
      //   resizable: true, //Allow an event to be resizable
      //   incrementsBadgeTotal: true, //If set to false then will not count towards the badge total amount on the month and year view
      //   //recursOn: 'week', // If set the event will recur on the given period. Valid values are year or month
      //   cssClass: 'balls' //A CSS class (or more, just separate with spaces) that will be added to the event when it is displayed on each view. Useful for marking an event as selected / active etc
      // }];

      vm.completeMeals = completeMeals;
      vm.placedMeals = placedMeals;

      function showModal(day) {
        //var self = this;
        $log.log('showModal', arguments);
        $modal.open({
          templateUrl: '/views/modals/food-calendar-modal.html',
          controller: function modalController($modalInstance, $scope) {
            //var vm = this;
            $log.log('modal controller running', arguments, placedMeals);

            $scope.completeMeals = completeMeals;
            $scope.placedMeals = placedMeals;
            $scope.selectedDate = day;
            $scope.placeMeal = function (meal, date) {
              var $mealPlaced;
              $log.log('Placing', arguments);
              meal.startsAt = day.date.toString();
              $mealPlaced = Meals.update(meal);
              $q.when($mealPlaced, function(pMl){
                var scheduledMeal = vm.wrap(meal);
                vm.events.splice(Utils.collIndexOf(vm.completeMeals, meal), 1);
                placedMeals.push(scheduledMeal);
              });

              event.stopPropagation();
            };
            //$log.log('modal scope', vm);
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

      // function eventEdited(calendarEvent) {
      //   $log.log('edited', arguments);
      //   var meal = Object.getPrototypeOf(calendarEvent);
      //   Meals.update(meal);
      // }

      function eventDeleted(calendarEvent) {
        $log.log('del', arguments);
        var meal = Object.getPrototypeOf(calendarEvent);
        meal.startsAt = null;
        Meals.update(meal);
        vm.events.splice(Utils.collIndexOf(vm.events, calendarEvent), 1);
        vm.completeMeals.push(meal);
      }

      // function timespanClick(calendarDate) {
      //   // if($(event.target).hasClass('cal-day-past')){ return false;}
      //   // $log.log('day clicked', event);
      //   // $log.log(arguments);
      //   // vm.showModal(calendarDate);
      //   // event.preventDefault();
      //   // event.stopPropagation();
      //   // return false;
      // }

      function setCalendarToToday() {
        vm.calendarDay = new Date();
      }

      function drillDownClick() {
        $log.log(arguments);

        return false;
      }

      function weekdayClick(day) {
        $log.log(day);
        //alert('yes!');
      }

      function addClicked(day) {
        if ($(event.target).hasClass('cal-day-past')) {
          return false;
        }
        $log.log('add clicked', event, arguments);
        vm.showModal(day);
        event.preventDefault();
        event.stopPropagation();
        // return false;
      }

      function eventTimesChanged(updatedEvent){
        $log.log('eventTimesChanged', arguments);
        var meal = Object.getPrototypeOf(updatedEvent);
        $log.log(typeof meal.startsAt);
        meal.startsAt = new Date(updatedEvent.startsAt);//moment(updatedEvent.startsAt).toDate();
        Meals.update(meal);
      }

      angular.extend(vm, {
        name: 'FoodCalendarCtrl',
        showModal: showModal,
        eventClicked: eventClicked,
      //  eventEdited: eventEdited,
        eventDeleted: eventDeleted,
      //  timespanClick: timespanClick,
        setCalendarToToday: setCalendarToToday,
        drillDownClick: drillDownClick,
        weekdayClick: weekdayClick,
        addClicked: addClicked,
        eventTimesChanged: eventTimesChanged,
        wrap: wrap
      });

    });
  }
}());
