(function () {
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('FoodCalendarCtrl', FoodCalendarCtrl);

  FoodCalendarCtrl.$inject = ['$modal', 'Meals', 'Auth', '$log', '$q', '$', '_', 'moment', 'Utils', 'toastr', '$window', '$timeout', '$scope', '$state'];

  function FoodCalendarCtrl($modal, Meals, Auth, $log, $q, $, _, moment, Utils, toastr, $window, $timeout, $scope, $state) {

    Auth.checkAuthorised();

    var meals, completeMeals, placedMeals, vm = this;

    function isValidDate(d) {
      if (Object.prototype.toString.call(d) !== "[object Date]")
        return false;
      return !isNaN(d.getTime());
    }

    function wrap(element, index, array) {

      var localStartDate, localEndDate, eventWrapper;

      eventWrapper = Object.create(element);
      localStartDate = moment(element.startsAt).local().toDate(); //.local().format("YYYY-MM-DD HH:mm");
      localEndDate = moment(element.startsAt).local().add(1, 'h').toDate(); //.local().add(1, 'h').format("YYYY-MM-DD HH:mm");
      $log.log('original', element.startsAt, typeof element.startsAt);
      $log.log('localStartDate', localStartDate, _.isDate(localStartDate));
      $log.log('localEndDate', localEndDate, _.isDate(localEndDate));

      if(!isValidDate(localStartDate)){
        throw new Error('Invalid start date');
      }

      if(!isValidDate(localEndDate)){
        throw new Error('Invalid end date');
      }

      eventWrapper = angular.extend(eventWrapper, {
        title: element.name, // The title of the event
        type: 'info', // The type of the event (determines its color). Can be important, warning, info, inverse, success or special
        startsAt: localStartDate, // A javascript date object for when the event starts
        endsAt: localEndDate, // Optional - a javascript date object for when the event ends
        editable: false, // If edit-event-html is set and this field is explicitly set to false then dont make it editable.
        deletable: true, // If delete-event-html is set and this field is explicitly set to false then dont make it deleteable
        draggable: true, //Allow an event to be dragged and dropped
        resizable: false, //Allow an event to be resizable
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

            $scope.completeMeals = vm.completeMeals;
            $scope.placedMeals = vm.placedMeals;
            $scope.selectedDate = day;
            $scope.wrap = wrap;
            $scope.placeMeal = function (meal, date) {
              var $updatedMeal, m = angular.copy(meal);
              $log.log('Placing', arguments);
              $log.log('DAY', day.date.toDate());
              m.startsAt = moment.utc(day.date); //cast to UTC Moment.
              $updatedMeal = Meals.update(m);
              $q.when($updatedMeal, function (updatedMeal) {
                $log.log('updatedMeal', updatedMeal);
                var scheduledMeal = vm.wrap(updatedMeal);
                $log.log('scheduledMeal', scheduledMeal);
                vm.completeMeals.splice(Utils.collIndexOf(vm.completeMeals, meal), 1);
                vm.placedMeals.push(updatedMeal);
                vm.events.push(scheduledMeal);
                if (completeMeals.length === 0) {
                  $modalInstance.close();
                }
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
        event.stopPropagation();
      }

      // function eventEdited(calendarEvent) {
      //   $log.log('edited', arguments);
      //   var meal = Object.getPrototypeOf(calendarEvent);
      //   Meals.update(meal);
      // }

      function eventDeleted(calendarEvent) {
        $log.log('del', arguments);
        var meal = Object.getPrototypeOf(calendarEvent),
          $updatedMeal, mealCopy;

        meal.startsAt = null;
        mealCopy = angular.copy(meal);

        $updatedMeal = Meals.update(mealCopy);
        $q.when($updatedMeal, function (updatedMeal) {
          vm.events.splice(Utils.collIndexOf(vm.events, calendarEvent), 1);
          vm.placedMeals.splice(Utils.collIndexOf(vm.placedMeals, meal), 1);
          vm.completeMeals.push(meal);
        });
        event.stopPropagation();
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
        $log.log('add clicked', event, arguments);
        vm.showModal(day);
        //event.preventDefault();
        event.stopPropagation();
      }

      function reset(event, scheduledMeal) {
        $window.location.reload();
      }

      // function reset(event, scheduledMeal) {
      //   $log.log('reset', arguments);
      //   $log.log('$window', $window);
      //
      //   var $el, offset;
      //   $el = $window.lastDragged;
      //   offset = $window.lastDraggedInitialPosition;
      //
      //   $timeout(function(){
      //     $log.log('resetting');
      //     $el.offset(offset);
      //   }, 2000);
      // }

      function eventTimesChanged(scheduledMeal, newStartTime) {
        $log.log('eventTimesChanged', arguments);
        $log.log('event', event);
        var meal = Object.getPrototypeOf(scheduledMeal),
          now = moment(),
          $updatedMeal,
          scheduledMeal;

        //if date is in the past return and error toast.
        if (moment(newStartTime).isBefore(now, 'day')) {
          toastr.warning('That date is in the past and will be disregarded!');
          return scheduledMeal;
        }

        meal.startsAt = moment(newStartTime);

        $log.log(meal, typeof meal.startsAt);

        $updatedMeal = Meals.update(meal);
        $q.when($updatedMeal, function (updatedMeal) {
          $log.log('updatedMeal', updatedMeal);
          var scheduledMeal = vm.wrap(updatedMeal);
          $log.log('scheduledMeal', scheduledMeal);
          vm.placedMeals.splice(Utils.collIndexOf(vm.placedMeals, meal), 1);
          vm.events.splice(Utils.collIndexOf(vm.events, meal), 1);
          vm.events.push(scheduledMeal);
          vm.placedMeals.push(updatedMeal);
        });
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
