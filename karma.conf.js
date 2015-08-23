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
      'bower_components/jquery/dist/jquery.js',
      'bower_components/angular/angular.js',
      'bower_components/lodash/lodash.js',
      'bower_components/angular-mocks/angular-mocks.js',
      'bower_components/angular-ui-router/release/angular-ui-router.js',
      'bower_components/angular-bootstrap/ui-bootstrap-tpls.js',
      'bower_components/angular-ui-grid/ui-grid.js',
      'bower_components/angular-animate/angular-animate.js',
      'bower_components/angular-sanitize/angular-sanitize.js',
      'bower_components/angular-cookies/angular-cookies.js',
      'bower_components/angular-resource/angular-resource.js',
      //'bower_components/restangular/dist/restangular.js',
      'bower_components/angular-socket-io/socket.min.js',
      //'bower_components/angular-socket-io/socket.min.js.map',
      'bower_components/api-check/dist/api-check.js',
      //'bower_components/angular-formly/dist/formly.js',
      //'bower_components/angular-formly-templates-bootstrap/dist/angular-formly-templates-bootstrap.js',
      'bower_components/angular-touch/angular-touch.js',
      'bower_components/angular-bootstrap-calendar/dist/js/angular-bootstrap-calendar-tpls.js',
      'bower_components/jquery-ui/ui/jquery-ui.js',
      'bower_components/fullcalendar/fullcalendar.js',
      'bower_components/moment/moment.js',
      'bower_components/bootstrap/dist/js/bootstrap.js',
      'bower_components/angular-gravatar/build/angular-gravatar.js',
      'bower_components/angular-toastr/dist/angular-toastr.tpls.js',
      'bower_components/angular-ui-calendar/src/calendar.js',
      'bower_components/i18n/i18n.js',
      'bower_components/d3/d3.js',
      'bower_components/nvd3/nv.d3.js',
      'bower_components/angular-nvd3/dist/angular-nvd3.min.js',
      'app.js',
      'views/**/*.js',
      'views/**/*.html',
      'services/**/*.js',
      'directives/**/*.js',
      'directives/**/*.html'
    ],

    exclude: [
      'views/**/*.e2e.js',
      'services/socket/socket.service.js'
    ],

    //reporters: ['progress', 'coverage'],
    //reporters: ['nyan', 'coverage'],

    reporters: ['nyan'],
    //reporters: ['nested'],

    coverageReporter: {
      type : 'html',
      dir : 'coverage/'
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
