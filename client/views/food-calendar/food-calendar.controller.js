(function(){
  'use strict';

  angular.module('kitchenapp')
    .controller('FoodCalendarCtrl', FoodCalendarCtrl);

    FoodCalendarCtrl.$inject = ['$modal', 'Meals', 'Auth', '$log', '$q', '$scope'];


    function FoodCalendarCtrl($modal, Meals, Auth, $log, $q, $scope) {

    Auth.checkAuthorised();

  	var meals, completeMeals, placedMeals, vm = this;

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
      vm.calendarView = 'month';
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


      vm.events = placedMeals || [];
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
            }
            $log.log('modal scope', vm);
          },
          contollerAs: 'vm'
        });
      }

      function eventClicked() {
      	$log.log('event clicked', event);
        //showModal('Clicked', event);
        event.preventDefault();
        event.stopPropagation();
      };

      function eventEdited() {
        vm.showModal('Edited', event);
      };

      function eventDeleted() {
        vm.showModal('Deleted', event);
      };

      function timespanClick(calendarDate){
        if($(event.target).hasClass('cal-day-past')){ return false;}
      	$log.log('day clicked', event);
      	$log.log(arguments);
      	vm.showModal(calendarDate);
        // event.preventDefault();
        // event.stopPropagation();
        // return false;
      };

      function setCalendarToToday() {
        vm.calendarDay = new Date();
      };

      function drillDownClick(){
        $log.log(arguments);

        return false;
      };

      angular.extend(vm, {
        name: 'FoodCalendarCtrl',
        showModal: showModal,
        eventClicked: eventClicked,
        eventEdited: eventEdited,
        eventDeleted: eventDeleted,
        timespanClick: timespanClick,
        setCalendarToToday: setCalendarToToday,
        drillDownClick: drillDownClick
      });

    });
  }
}());
