'use strict';

angular.module('wuzzlerUi')
  .config(function ($stateProvider) {
    $stateProvider.state('table', {
      url: '/table',
      templateUrl: 'app/table/table.html',
      controller: 'TableCtrl'
    });
  })

  .controller('TableCtrl', function  ($scope, $interval, wuzzlerData) {
    window.MY_SCOPE = $scope;
    $scope.data = wuzzlerData;

    var periods=['day', 'week', 'month', 'year', 'all'];
    $scope.period='';
    $scope.nextPeriod = function(){
      var next=periods[(
        (periods.indexOf($scope.period)+1)%
        periods.length
      )];

      $scope.data.getTop10(next, function(err, res){
          $scope.period = next;
          $scope.top10 = res;
          $scope.$apply();
      });
    };



    var timer=$interval($scope.nextPeriod, 30000);
    $scope.$on('$destroy', function() {
      $interval.cancel(timer);
    });

    $scope.nextPeriod();

  });
