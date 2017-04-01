'use strict';

angular.module('wuzzlerDataService', [])

  .factory('wuzzlerData', ['$rootScope', function ($rootScope) {

    //var client = new Eureca.Client({ uri:"http://raspberrypi.local/" });
    var client = new Eureca.Client({ uri:window.location.origin});
    var server;

    client.ready(function (proxy) {
      console.log("eureca ready")
      console.log(proxy)
      server = proxy;
      exports.server = server;
      $rootScope.$apply();
    });
    var wuzzlerClient=client.exports.wuzzlerClient ={};
    wuzzlerClient.update=function(state){
      console.log('update called', state);
      var prevState = exports.state;
      exports.state=state;
      if(prevState && prevState.game.state!=state.game.state){
        if (state.game.state === 'none'){
          window.location.href='#/table'
        }else{
          window.location.href='#/status'
        }
      }

      $rootScope.$apply();
    }

    client.onConnect(function () {
      console.log("eureca connected")
      console.log("server"+JSON.stringify(server))
    });

    var exports = {
      client: client,
      user: {},
      test: function(){
        exports.user.score++;
        $rootScope.$apply();
      },
      getTop10: function(period, callback){
        if(!server){
          setTimeout(function(){
            exports.getTop10(period, callback)
          }, 500);

          return;
        };
        server.getTop10(period||'all').onReady(function (res){
          console.log(res);
          if(!res.success){
            console.log('error retrieving top10', res.error);
            callback(res.error);
          }else{
            callback(null, res.result);
          }
        });
      },
      debug: this
    };

    return exports
  }])
;
