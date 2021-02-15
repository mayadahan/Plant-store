const redis = require('redis');
const client = redis.createClient(6379);

//master username and password in Redis
client.hmset("admin","name", "admin", "password", "admin");
// client.keys('*', (err, data)=> {
//     for(let i = 0; i < data.length; i++){
//         if(data[i] !== 'admin'){
//             client.hgetall(data[i], (error, result)=> {
//                 console.log(result);
//             })
//         }
//     }
// });

// client.hmset("hosts", "mjr", "1", "another", "23", "home", "1234");
// client.hmset("hosts", "mjr", "5");
// client.hgetall("hosts", function (err, obj) {
//     console.dir(obj);
// });

// let obj = {
//     name: "Ahsan",
//     cast: "shamsi",
//     items: [{
//         name: 'potato'
//     }, {
//         name: 'Tomato'
//     }]
// }
// client.hmset('user-ahsann','items', JSON.stringify(obj));
//
// client.hgetall('user-ahsann', (err,data)=> console.log(JSON.parse(data.items)));

// client.keys('user-*', (err, data)=> console.log(data));

module.exports = client;
