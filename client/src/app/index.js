'use strict';

angular.module('wuzzlerClient', [
  'ngCookies',
  'ngTouch',
  'ngSanitize',
  'ui.router',
  'mm.foundation',
  'wuzzlerDataService'
])

.config(function ($urlRouterProvider) {
  $urlRouterProvider.otherwise('/login');
})

;
