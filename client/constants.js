/* global toastr:false, moment:false */
(function() {
    'use strict';

    // Constants used by the entire app
    angular
        .module('kitchenapp')
        .constant('toastr', toastr)
        .constant('moment', moment)
        .constant('d3', d3)
        .constant('nv', nv)
        .constant('$', $)
        .constant('_', _);



    // Constants used only by the sales module
    // angular
    //   .module('app.sales')
    //   .constant('events', {
    //       ORDER_CREATED: 'event_order_created',
    //       INVENTORY_DEPLETED: 'event_inventory_depleted'
    //   });

})();
