'use strict';
angular.module('wuzzlerUi', [
  'ngAnimate',
  'ngCookies',
  'ngSanitize',
  'ui.router',
  'wuzzlerDataService'
])

.config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/status');
})

;
