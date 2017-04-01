'use strict';

angular.module('wuzzlerClient')
  .config(function ($stateProvider) {
    $stateProvider.state('challenge', {
      url: '/challenge',
      templateUrl: 'app/challenge/challenge.html',
      controller: 'challengeCtrl'
    });
  })

  .controller('challengeCtrl',function ($scope,$location, wuzzlerData) {
    window.MY_SCOPE = $scope;
    window.MY_Location = $location;
    $scope.data = wuzzlerData;

    $scope.click = function(msg){
      console.log('test', msg);
    }

  });
