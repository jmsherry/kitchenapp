/**
 * Files injected into index.html by gulp-inject
 * used by tasks inject & watch
 */

module.exports = {
  js: [
    'client/app.js',
    'client/templates/templates.js',
    'client/animations/*.js',
    'client/directives/**/*.js', '!client/directives/**/*.spec.js',
    'client/filters/**/*.js', '!client/filters/**/*.spec.js',
    'client/services/**/*.js', '!client/services/**/*.spec.js',
    'client/views/**/*.js', '!client/views/**/*.spec.js', '!client/views/**/*.e2e.js', '!client/views/**/*.page.js'
  ],
  css: [
    'client/styles/css/app.css'
  ]
};
