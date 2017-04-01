function log(msg){
    console.log("db_mock: " + msg);
}

var user={
   id: 1,
   name: "hugo",
   score: 100,
   sign_up: "2015-04-08T13:18:39.643Z",
   cookie: "somecoolcookie"
}

var statsline={
    rank: 1,
    name: "hugo",
    points: 10,
    games: 3,
    won: 2,
    lost: 0
};

var top10=[
        statsline,
        statsline,
        statsline,
        statsline,
        statsline,
        statsline,
        statsline,
        statsline,
        statsline,
        statsline,
        statsline
]


exports.init = function(conf){
    return {
        login: function(username, passwd, callback){
            log("login: " + username +"/" + passwd);
            callback(null, user);
        },
        register: function(username, passwd, callback){
            log("register: " + username +"/" + passwd);
            callback(null, user);
        },
        getUser: function(cookie, callback){
            log("getUser: " + cookie);
            callback(null, user);
        },
        getTop: function (group, limit, callback){
            log("getTop: " + group + "/" + limit);
            callback(null, user);
        }
    }
};
