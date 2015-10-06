(function () {
  'use strict';

  angular.module('kitchenapp.controllers')
    .controller('BudgetCtrl', BudgetCtrl);

  BudgetCtrl.$inject = ['Shopping', 'Transaction', 'Auth', '$q', 'Meals', '$log', '$scope', 'd3', 'moment', '$window', '$timeout'];

  function BudgetCtrl(Shopping, Transaction, Auth, $q, Meals, $log, $scope, d3, moment, $window, $timeout) {

    Auth.checkAuthorised();

    var vm = this,
      $user = Auth.getUser(),
      budget,
      $data;

    function paginateNext() {
      $log.log('paginateNext');
      vm.currentDay.add(7, 'd');
      event.stopPropagation();
    }

    function paginatePrev() {
      $log.log('paginatePrev');
      vm.currentDay.subtract(7, 'd');
      event.stopPropagation();
    }

    function goToToday() {
      event.stopPropagation();
      $log.log('goToToday');
      if(vm.currentDay.isSame(moment(), 'date')){
        $log.warn('Was already viewing this week');
        return;
      }
      vm.currentDay = moment();
    }

    $scope.$watch('vm.currentDay', function(oldValue, newValue){
      $log.log('Day change! ', arguments);
      if(newValue.isSame(moment(), 'd')){
        vm.thisWeek = true;
      } else {
        vm.thisWeek = false;
      }
      getData(newValue);
    }, true);

    function getData(currentDay){
      var $data = Transaction.getBudgetInformation(currentDay);
      $q.when($data, function (data) {

        $log.log('data', data);
        vm.data = data;

      });
    }

    $q.when($user, function (user) {
      budget = user.budget

      getData(vm.currentDay);

      vm.options = {
        chart: {
          type: "multiBarChart",
          height: 450,
          margin: {
            top: 20,
            right: 20,
            bottom: 60,
            left: 45
          },
          callback: function (chart) {
            //$log.log('GYGYYGYGYGYGGYYYGYGYGYGYGYGY', chart);
            if ($window.innerWidth < 767) {
              //d3.select(".nv-legendWrap").attr('transform', 'translate(-90, -60)');
              d3.select(".nv-controlsWrap").attr('transform', 'translate(-75, -55)');
              d3.select(".nv-controlsWrap .nv-series:last-child").attr('transform', 'translate(0, 25)');
            }
          },
          clipEdge: true,
          staggerLabels: false,
          transitionDuration: 500,
          stacked: true,
          xAxis: {
            axisLabel: "Day",
            tickFormat: function (d) {
              return moment(d).format('dddd Do');
            },
            showMaxMin: false,
            dispatch: {},
            axisLabelDistance: 0,
            staggerLabels: false,
            rotateLabels: 0,
            rotateYLabel: true,
            height: 60,
            ticks: null,
            width: 75,
            margin: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            duration: 250,
            orient: "bottom",
            tickValues: null,
            tickSubdivide: 0,
            tickSize: 6,
            tickPadding: 7,
            domain: [
              0,
              1
            ],
            range: [
              0,
              1
            ]
          },
          yAxis: {
            axisLabel: "Cost",
            axisLabelDistance: 30,
            tickFormat: function (d) {
              return '£' + d3.format(',.2f')(d);
            },
            dispatch: {},
            staggerLabels: false,
            rotateLabels: 0,
            rotateYLabel: true,
            showMaxMin: true,
            height: 60,
            ticks: null,
            width: 75,
            margin: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            duration: 250,
            orient: "left",
            tickValues: null,
            tickSubdivide: 0,
            tickSize: 6,
            tickPadding: 3,
            domain: [
              0,
              1
            ],
            range: [
              0,
              1
            ]
          },
          dispatch: {
            stateChange: function (chart) {
              //$log.log('PUPUPUPUPUPUPUPUPUPUPUPUPUP', chart);
              $timeout(function () {
                if ($window.innerWidth < 767) {
                  //d3.select(".nv-legendWrap").attr('transform', 'translate(-90, -60)');
                  d3.select(".nv-controlsWrap").attr('transform', 'translate(-75, -55)');
                  d3.select(".nv-controlsWrap .nv-series:last-child").attr('transform', 'translate(0, 25)');
                }
              });
            }
          },
          multibar: {
            dispatch: {},
            width: 960,
            height: 500,
            forceY: [
              0
            ],
            stacked: false,
            stackOffset: "zero",
            clipEdge: true,
            id: 3295,
            hideable: false,
            groupSpacing: 0.1,
            margin: {
              top: 0,
              right: 0,
              bottom: 0,
              left: 0
            },
            duration: 500,
            barColor: null
          },
          legend: {
            dispatch: {},
            width: 400,
            height: 20,
            align: true,
            rightAlign: true,
            padding: 32,
            updateState: true,
            radioButtonMode: false,
            expanded: false,
            vers: "classic",
            margin: {
              top: 5,
              right: 0,
              bottom: 5,
              left: 0
            }
          },
          controls: {
            dispatch: {
              stateChange: function (c) {
                //$log.log('CYCYCYCYCYCYCYCYCYCYCYCYCYCYC', c);
                if ($window.innerWidth < 767) {
                  //d3.select(".nv-legendWrap").attr('transform', 'translate(-90, -60)');
                  d3.select(".nv-controlsWrap").attr('transform', 'translate(-90, -60)');
                  d3.select(".nv-controlsWrap .nv-series:last-child").attr('transform', 'translate(0, 25)');
                }
              }
            },
            width: 100,
            height: 20,
            align: true,
            rightAlign: false,
            padding: 32,
            updateState: true,
            radioButtonMode: false,
            expanded: false,
            vers: "classic",
            margin: {
              top: 5,
              right: 0,
              bottom: 5,
              left: -50
            }
          },
          tooltip: {
            duration: 0,
            gravity: "w",
            distance: 25,
            snapDistance: 0,
            classes: null,
            chartContainer: null,
            fixedTop: null,
            enabled: true,
            hideDelay: 400,
            headerEnabled: true,
            position: {
              left: 320,
              top: 368
            },
            offset: {
              left: 0,
              top: 0
            },
            hidden: true,
            data: null,
            tooltipElem: null,
            id: "nvtooltip-56238"
          },
          width: null,
          forceY: [
            0
          ],
          stackOffset: "zero",
          hideable: false,
          groupSpacing: 0.1,
          duration: 250,
          showLegend: true,
          showControls: true,
          controlLabels: {},
          showXAxis: true,
          showYAxis: true,
          defaultState: null,
          noData: null,
          reduceXTicks: true,
          rotateLabels: 0,
          tooltips: true,
          rightAlignYAxis: false
        },
        title: {
          enable: false,
          text: "Write Your Title",
          className: "h4",
          css: {
            width: "nullpx",
            textAlign: "center"
          }
        },
        subtitle: {
          enable: false,
          text: "Write Your Subtitle",
          css: {
            width: "nullpx",
            textAlign: "center"
          }
        },
        caption: {
          enable: false,
          text: "Figure 1. Write Your Caption text.",
          css: {
            width: "nullpx",
            textAlign: "center"
          }
        },
        styles: {
          classes: {
            "with-3d-shadow": true,
            "with-transitions": true,
            "gallery": false
          },
          css: {}
        }
      }

      angular.extend(vm, {
        name: 'BudgetCtrl',
        budget: budget,
        currentDay: moment(),
        thisWeek: true,
        paginateNext: paginateNext,
        paginatePrev: paginatePrev,
        goToToday: goToToday,
        getData: getData
      });
    });
  }
}());
