'use strict';

angular.module('wuzzlerClient')
  .config(function ($stateProvider) {
    $stateProvider.state('login', {
      url: '/login',
      templateUrl: 'app/login/login.html',
      controller: 'LoginCtrl'
    });
  })

  .controller('LoginCtrl',function ($scope, wuzzlerData) {
    window.MY_SCOPE = $scope;
    $scope.data = wuzzlerData;
    $scope.passwd = null;
    $scope.username= null;
    $scope.message = null;

    $scope.login = function(){
      $scope.message=null;

      if(!($scope.username)){
        $scope.message="username missing"
        $scope.apply();
        return;
      }

      if(!($scope.passwd)){
        $scope.message="password missing"
        $scope.apply();
        return;
      }

      console.log("login (" +
        $scope.username+  "/" +
        $scope.passwd+    ")"
      );

      function callback(err, res){
        if(err){
          console.error(err);
          $scope.message=err;
          $scope.$apply();
          return;
        }
        console.log(res);
      }

      wuzzlerData.login(
        $scope.username,
        $scope.passwd,
        callback
      );
    };

    $scope.register = function(){
      $scope.message=null;
      console.log("register (" +
        $scope.username+  "/" +
        $scope.passwd+    ")"
      );

      if(!($scope.username)){
        $scope.message="username missing"
        $scope.apply();
        return;
      }

      if(!($scope.passwd)){
        $scope.message="password missing"
        $scope.apply();
        return;
      }

      function callback(err, res){
        if(err){
          console.error(err);
          $scope.message=err;
          $scope.$apply();
          return;
        }
        console.log(res);
      }

      wuzzlerData.register(
        $scope.username,
        $scope.passwd,
        callback
      );
    };

  });
