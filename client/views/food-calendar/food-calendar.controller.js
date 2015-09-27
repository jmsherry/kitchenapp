(function () {
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('FoodCalendarCtrl', FoodCalendarCtrl);

  FoodCalendarCtrl.$inject = ['$modal', 'Meals', 'Auth', '$log', '$q', '$', '_', 'moment', 'Utils'];

  function FoodCalendarCtrl($modal, Meals, Auth, $log, $q, $, _, moment, Utils) {

    Auth.checkAuthorised();

    var meals, completeMeals, placedMeals, vm = this;

    function wrap(element, index, array) {

      var localStartDate, localEndDate, eventWrapper;

      eventWrapper = Object.create(element);
      // localStartDate = moment(element.startsAt).toDate();//.local().format("YYYY-MM-DD HH:mm");
      // localEndDate = moment(element.startsAt).toDate();//.local().add(1, 'h').format("YYYY-MM-DD HH:mm");
      $log.log('original', element.startsAt, typeof element.startsAt);
      // $log.log('localStartDate', localStartDate, typeof localStartDate);
      // $log.log('localEndDate', localEndDate, typeof localEndDate);

      eventWrapper = angular.extend(eventWrapper, {
        title: element.name, // The title of the event
        type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
        startsAt: new Date(element.startsAt), // A javascript date object for when the event starts
        endsAt: localEndDate, // Optional - a javascript date object for when the event ends
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

      // $log.log("meals data: ", data);
      // $log.log("mls", mls);
      $log.log("completeMeals: ", completeMeals);
      $log.log("placedMeals: ", placedMeals);
      $log.log("vm.events: ", vm.events);

      vm.canAdd = completeMeals.length > 0 ? true : false;

      //These variables MUST be set as a minimum for the calendar to work
      vm.calendarView = 'month';
      vm.calendarDay = new Date();

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
            $scope.wrap = wrap;
            $scope.placeMeal = function (meal, date) {
              var $mealPlaced, m = angular.copy(meal);
              $log.log('Placing', arguments);
              $log.log('DAY', day.date.toDate());
              m.startsAt = moment.utc(day.date); //cast to UTC Moment.
              $mealPlaced = Meals.update(m);
              $q.when($mealPlaced, function (pML) {
                $log.log(pML);
                var scheduledMeal = vm.wrap(meal);
                completeMeals.splice(Utils.collIndexOf(completeMeals, meal), 1);
                placedMeals.push(scheduledMeal);
              });

              //event.stopPropagation();
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

      function eventTimesChanged(updatedEvent) {
        $log.log('eventTimesChanged', arguments);
        var meal = Object.getPrototypeOf(updatedEvent), scheduledMeal;
        $log.log(typeof meal.startsAt);
        meal.startsAt = moment.utc(updatedEvent.startsAt, 'DD-MM-YYYY').toDate();
        Meals.update(meal);
        scheduledMeal = vm.wrap(meal);
        placedMeals.splice(Utils.collIndexOf(placedMeals, updatedEvent), 1);
        placedMeals.push(scheduledMeal);
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
