'use strict';

angular.module('wuzzlerDataService', [])

  .factory('wuzzlerData', ['$rootScope', function ($rootScope) {

    var client = new Eureca.Client({ uri: "localhost:3000" });
    //var client = new Eureca.Client({ uri:window.location.origin});
    var server;

    client.ready(function (proxy) {
      console.log("eureca ready")
      console.log(proxy)
      server = proxy;
      exports.server = server;

      server.setSession(
        localStorage.getItem("sessionId")
      ).onReady(function (res){
        console.log(res);
        if(!res.success){
          console.log('noSession', res.result)
          window.location.href='#/login'
        }else{
          exports.user=res.result;
          console.log('Session restored', res.result)
          exports.user=res.result;
          window.location.href='#/profile'
        }
        $rootScope.$apply();
      });
    });
    var wuzzlerClient=client.exports.wuzzlerClient ={};
    wuzzlerClient.update=function(state){
      console.log('update called', state);
      exports.state=state;
      $rootScope.$apply();
    }

    client.onConnect(function () {
      console.log("eureca connected")
      console.log("server"+JSON.stringify(server))
      server.setSession(
        localStorage.getItem("sessionId")
      ).onReady(function (res){
        console.log(res);
        if(!res.success){
          console.log('noSession', res.result)
          window.location.href='#/login'
        }else{
          exports.user=res.result;
          console.log('Session restored', res.result)
          exports.user=res.result;
          window.location.href='#/profile'
        }
        $rootScope.$apply();
      });
    });

    client.exports.update=function(state){
      exports.state=state;
    }

    var exports = {
      client: client,
      user: {},
      test: function(){
        exports.user.score++;
        $rootScope.$apply();
      },
      getUserStats: function(user, period, callback){
        console.log('gettingUserStats:',user, period);
        if(!server){
          setTimeout(function(){
            exports.getUserStats(user, period, callback)
          }, 500);

          return;
        };
        server.getUserStats(user||exports.user.name, period||'all').onReady(function (res){
          console.log('UserStats:',res);
          if(!res.success){
            console.log('error retrieving top10', res.error);
            callback(res.error);
          }else{
            callback(null, res.result);
          }
        });
      },
      login: function(user, passwd, callback){
        server.login({
          username:user,
          passwd:passwd
        }).onReady(function (res){
          console.log(res);
          if(!res.success){
            console.log('login_failed', res.error);
            callback(res.error);
          }else{
            exports.user=res.result;
            console.log('logged_in', res.result);
            user=res.result;
            localStorage.setItem("sessionId", user.cookie);
            window.location.href='#/profile'
            callback(null, res.result);
          }
        });
      },
      register: function(user, passwd, callback){
        server.register({
          username:user,
          passwd:passwd
        }).onReady(function (res){
          console.log(res);
          if(!res.success){
            console.log('register_failed', res.result)
            callback(res.error);
          }else{
            exports.user=res.result;
            console.log('registered', res.result)
            user=res.result;
            localStorage.setItem("sessionId", user.cookie);
            window.location.href='#/profile'
            callback(null, res.result);
          }
        });
      },
      debug: this
    };

    return exports
  }])
;
