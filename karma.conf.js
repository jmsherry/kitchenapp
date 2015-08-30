'use strict';

module.exports = function (config) {
  config.set({

    basePath: 'client',

    frameworks: ['jasmine'],

    preprocessors: {
      '**/*.html': ['ng-html2js'],
      '!(bower_components)/**/!(*.spec).js': ['coverage']
    },

    ngHtml2JsPreprocessor: {
      stripPrefix: 'client/',
      moduleName: 'templates'
    },

    plugins: [
      'karma-phantomjs-launcher',
      'karma-jasmine',
      'karma-ng-html2js-preprocessor',
      'karma-chrome-launcher',
      'karma-firefox-launcher',
      'karma-nyan-reporter',
      'karma-coverage'
    ],

    files: [
      "/client/bower_components/angular/angular.js",
      "/client/bower_components/d3/d3.js",
      "/client/bower_components/nvd3/nv.d3.js",
      "/client/bower_components/angular-nvd3/dist/angular-nvd3.min.js",
      "/client/bower_components/jquery/dist/jquery.js",
      "/client/bower_components/angular-resource/angular-resource.js",
      "/client/bower_components/angular-sanitize/angular-sanitize.js",
      "/client/bower_components/angular-animate/angular-animate.js",
      "/client/bower_components/angular-socket-io/socket.js",
      "/client/bower_components/angular-bootstrap/ui-bootstrap-tpls.js",
      "/client/bower_components/angular-ui-grid/ui-grid.js",
      "/client/bower_components/angular-ui-router/release/angular-ui-router.js",
      "/client/bower_components/moment/moment.js",
      "/client/bower_components/bootstrap/dist/js/bootstrap.js",
      "/client/bower_components/angular-touch/angular-touch.js",
      "/client/bower_components/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js",
      "/client/bower_components/lodash/lodash.js",
      "/client/bower_components/angular-gravatar/build/angular-gravatar.js",
      "/client/bower_components/angular-toastr/dist/angular-toastr.tpls.js",
      "/client/bower_components/i18n/i18n.js",
      "/client/bower_components/fastdom/index.js",
      "/client/bower_components/angular-ui-select/dist/select.js",
      "/client/bower_components/interact/interact.js",
      "/client/bower_components/angular-cookies/angular-cookies.js",
      "/client/app.js",
      "/client/directives/gravatar-conf/gravatar.conf.js",
      "/client/directives/ingredient-form/ingredient-form.directive.js",
      "/client/directives/nav-bar/nav-bar.directive.js",
      "/client/directives/numbersOnly/numbersOnly.directive.js",
      "/client/directives/recipe-form/recipe-form.directive.js",
      "/client/filters/currency.js",
      "/client/services/auth/auth.js",
      "/client/services/cupboard/cupboard.js",
      "/client/services/meals/meals.js",
      "/client/services/ingredients/ingredients.js",
      "/client/services/population/population.js",
      "/client/services/recipes/recipes.js",
      "/client/services/shopping/shopping.js",
      "/client/services/socket/socket.mock.js",
      "/client/services/socket/socket.service.js",
      "/client/services/transaction/transaction.js",
      "/client/views/cupboard/cupboard.controller.js",
      "/client/views/cupboard/cupboard.js",
      "/client/views/food-calendar/food-calendar.controller.js",
      "/client/views/food-calendar/food-calendar.js",
      "/client/views/home/home.controller.js",
      "/client/views/home/home.js",
      "/client/views/ingredients/ingredients.add.controller.js",
      "/client/views/ingredients/ingredients.js",
      "/client/views/ingredients/ingredients.list.controller.js",
      "/client/views/login/login.controller.js",
      "/client/views/login/login.js",
      "/client/views/meals/meals.controller.js",
      "/client/views/meals/meals.js",
      "/client/views/profile/profile.controller.js",
      "/client/views/profile/profile.js",
      "/client/views/recipes/recipes.add.controller.js",
      "/client/views/recipes/recipes.js",
      "/client/views/recipes/recipes.list.controller.js",
      "/client/views/shop/budget.controller.js",
      "/client/views/shop/shop.controller.js",
      "/client/views/shop/shop.js",
      "/client/views/signup/signup.controller.js",
      "/client/views/signup/signup.js"
    ],

    exclude: [
      'views/**/*.e2e.js',
      'views/**/*.page.js',
      'services/socket/socket.service.js'
    ],

    //reporters: ['progress', 'coverage'],
    reporters: ['nyan', 'coverage'],

    //reporters: ['nyan'],
    //reporters: ['nested'],

    coverageReporter: {
          // specify a common output directory
          dir: 'build/reports/coverage',
          reporters: [
            // reporters not supporting the `file` property
            { type: 'html', subdir: 'report-html' },
            { type: 'lcov', subdir: 'report-lcov' },
            // reporters supporting the `file` property, use `subdir` to directly
            // output them in the `dir` directory
            { type: 'cobertura', subdir: '.', file: 'cobertura.txt' },
            { type: 'lcovonly', subdir: '.', file: 'report-lcovonly.txt' },
            { type: 'teamcity', subdir: '.', file: 'teamcity.txt' },
            { type: 'text', subdir: '.', file: 'text.txt' },
            { type: 'text-summary', subdir: '.', file: 'text-summary.txt' },
          ],
          instrumenterOptions: {
            istanbul: { noCompact: true }
          }
        },

    port: 9876,

    colors: true,

    // possible values:
    // config.LOG_DISABLE
    // config.LOG_ERROR
    // config.LOG_WARN
    // config.LOG_INFO
    // config.LOG_DEBUG
    logLevel: config.LOG_INFO,

    autoWatch: false,

    browsers: ['PhantomJS'],
    //browsers: ['Chrome'],

    //singleRun: false
    singleRun: true
  });
};
