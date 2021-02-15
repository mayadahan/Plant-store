const redis = require('redis');
const client = redis.createClient(6379);

//master username and password in Redis
client.hmset("admin","name", "admin", "password", "admin");

module.exports = client;
