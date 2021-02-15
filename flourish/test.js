const redis = require('redis');
const client = redis.createClient(6379);

//Test redis connection
if (client.connected) {
    console.log("redis connection is up");
} else {
    console.log("redis connection is down");
}

//test setting and retrieving object to redis
client.hmset("testhashkey",{a:1, b:2, c:'abc'})
client.hmget("myhatesthashkeyshkey", function(obj) {
    console.log(obj);
 });


//Test master username and password in Redis
client.hmset("admin","name", "testAdmin", "password", "testAdmin");
client.keys('*', (err, data)=> {
    for(let i = 0; i < data.length; i++){
        if(data[i] !== 'testAdmin'){
            client.hgetall(data[i], (error, result)=> {
                console.log(result);
            })
        }
    }
});

client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
client.hmset("hosts", "mjr", "5");
client.hgetall("hosts", function (err, obj) {
    console.dir(obj);
});

let obj = {
    name: "Testuser",
    cast: "TestUser",
    items: [{
        name: 'flower'
    }, {
        name: 'plant'
    }]
}
client.hmset('user-test','items', JSON.stringify(obj));

client.hgetall('user-test', (err,data)=> console.log(JSON.parse(data.items)));

client.keys('user-*', (err, data)=> console.log(data));

//test retrieving a non-existing object in redis
client.hmget("nonexistingobj", (err,data)=> console.log(JSON.parse(data.items)));

module.exports = client;
