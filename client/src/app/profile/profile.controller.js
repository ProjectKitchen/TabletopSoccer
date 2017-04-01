'use strict';

angular.module('wuzzlerClient')
  .config(function ($stateProvider) {
    $stateProvider.state('profile', {
      url: '/profile',
      templateUrl: 'app/profile/profile.html',
      controller: 'profileCtrl'
    });
  })

  .controller('profileCtrl',function ($scope, wuzzlerData) {
    window.MY_SCOPE = $scope;
    $scope.data = wuzzlerData;

    $scope.user = wuzzlerData.user;

    var periods=['all', 'day', 'week', 'month', 'year'];

    $scope.stats=[];

    function getUserStats(i){
      $scope.data.getUserStats(null,periods[i], function(err, res){
        if(!err && res){
          res.label=periods[i];
          $scope.stats.push(res);
        }
        if(i<periods.length-1){
          getUserStats(i+1)
        }else{
          $scope.$apply();
        }
      });
    }

    getUserStats(0);


  });

  angular.module('wuzzlerClient').controller('ModalInstanceCtrl', function ($scope, $modalInstance, items) {

    $scope.items = items;
    $scope.selected = {
      item: $scope.items[0]
    };

    $scope.ok = function () {
      $modalInstance.close($scope.selected.item);
    };

    $scope.cancel = function () {
      $modalInstance.dismiss('cancel');
    };
  });
