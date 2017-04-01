'use strict';

angular.module('wuzzlerUi')
  .config(function ($stateProvider) {
    $stateProvider.state('status', {
      url: '/status',
      templateUrl: 'app/status/status.html',
      controller: 'StatusCtrl'
    });
  })

  .controller('StatusCtrl', function ($scope, wuzzlerData) {
    window.MY_SCOPE = $scope;
    $scope.data = wuzzlerData;
  });
