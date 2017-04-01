var assert = require("assert")

describe('LoggedIn: none', function(){
    beforeEach(function(done){
        sessions=require('../sessions');
        sessions.addConnection(1, {});
        sessions.addConnection(2, {});
        sessions.addConnection(3, {});
        sessions.addConnection(4, {});
        sessions.onLogin=function(user, passwd, callback){
            callback(null,{name:user, score:100, cookie:"cookie"});
        };
        sessions.onRegister=function(user, passwd, callback){
            callback(null,{name:user, score:100, cookie:"cookie"});
        };
        done();
    });

    it('login: test', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {users:{test:{to:[],by:[],available:[]}},waitingGames:[]});
            done();
        };
        sessions.login(1, 'test', 'test');
    });

    it('register: test', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {users:{test:{to:[],by:[],available:[]}},waitingGames:[]});
            done();
        };
        sessions.register(1, 'test', 'test');
    });

    it('removeConnection', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {users:{},waitingGames:[]});
            done();
        };
        sessions.removeConnection(1);
    });
})

describe('create and remove connections', function(){
    before(function(done){
        sessions=require('../sessions');
        sessions.addConnection(1, {});
        sessions.addConnection(2, {});
        sessions.addConnection(3, {});
        sessions.addConnection(4, {});
        sessions.onLogin=function(user, passwd, callback){
            callback(null,{name:user, score:100, cookie:"cookie"});
        };
        sessions.onRegister=function(user, passwd, callback){
            callback(null,{name:user, score:100, cookie:"cookie"});
        };
        done();
    });

    it('login: test', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {users:{test:{to:[],by:[],available:[]}},waitingGames:[]});
            done();
        };
        sessions.login(1, 'test', 'test');
    });

    it('login: test', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {users:{test:{to:[],by:[],available:[]}},waitingGames:[]});
            done();
        };
        sessions.login(2, 'test', 'test');
    });

    it('removeConnection', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {users:{test:{to:[],by:[],available:[]}},waitingGames:[]});
            done();
        };
        sessions.removeConnection(2);
    });

    it('removeConnection', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {users:{},waitingGames:[]});
            done();
        };
        sessions.removeConnection(1);
    });
})

describe('challenge', function(){
    before(function(done){
        sessions=require('../sessions');
        sessions.addConnection(1, {});
        sessions.addConnection(2, {});
        sessions.addConnection(3, {});
        sessions.addConnection(4, {});
        sessions.onLogin=function(user, passwd, callback){
            callback(null,{name:user, score:100, cookie:"cookie"});
        };
        sessions.onRegister=function(user, passwd, callback){
            callback(null,{name:user, score:100, cookie:"cookie"});
        };
        done();
    });

    it('login: test', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {users:{test:{to:[],by:[],available:[]}},waitingGames:[]});
            done();
        };
        sessions.login(1, 'test', 'test');
    });

    it('login: test2', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {
                users:{
                    test:{to:[],by:[],available:["test2"]},
                    test2:{to:[],by:[],available:["test"]}
                },
                waitingGames:[]
            });
            done();
        };
        sessions.login(2, 'test2', 'test');
    });

    it('challenge: test->test', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {
                users:{
                    test:{to:[],by:[],available:["test2"]},
                    test2:{to:[],by:[],available:["test"]}
                },
                waitingGames:[]
            });
            done();
        };
        sessions.addChallenge(1, 'test');
    });

    it('challenge: test->test2', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {
                users:{
                    test:{to:["test2"],by:[],available:[]},
                    test2:{to:[],by:["test"],available:[]}
                },
                waitingGames:[]
            });
            done();
        };
        sessions.addChallenge(1, 'test2');
    });

    it('dismiss challenge: test->test2', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {
                users:{
                    test:{to:["test2"],by:[],available:[]},
                    test2:{to:[],by:["test"],available:[]}
                },
                waitingGames:[]
            });
            done();
        };
        sessions.dismissChallenge(1, 'test2');
    });

    it('cancel challenge: test2->test1', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {
                users:{
                    test:{to:[],by:[],available:["test2"]},
                    test2:{to:[],by:[],available:["test"]}
                },
                waitingGames:[]
            });
            done();
        };
        sessions.cancelChallenge(1, 'test2');
    });

    it('dismiss challenge: test2->test', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {
                users:{
                    test:{to:[],by:[],available:["test2"]},
                    test2:{to:[],by:[],available:["test"]}
                },
                waitingGames:[]
            });
            done();
        };
        sessions.dismissChallenge(2, 'test');
    });

    it('challenge: test->test2', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {
                users:{
                    test:{to:["test2"],by:[],available:[]},
                    test2:{to:[],by:["test"],available:[]}
                },
                waitingGames:[]
            });
            done();
        };
        sessions.addChallenge(1, 'test2');
    });

    it('cancel challenge: test->test2', function(done){
        sessions.onSync=function(sessions){
            assert.deepEqual(sessions, {
                users:{
                    test:{to:[],by:[],available:["test2"]},
                    test2:{to:[],by:[],available:["test"]}
                },
                waitingGames:[]
            });
            done();
        };
        sessions.cancelChallenge(1, 'test2');
    });

})
