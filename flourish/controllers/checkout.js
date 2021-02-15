const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const client = require('./redisConnector')
const jwt = require('jsonwebtoken');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

function parseCookies (request) {
    let list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function( cookie ) {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

function accumlate(){
    return new Promise((resolve, reject) => {
        let arr = [];
        client.keys('*', (err, data)=> {
            for(let i = 0; i < data.length; i++) {
                if (data[i] !== 'admin') {
                    client.hgetall(data[i], (error, Rresult) => {
                        arr.push(Rresult);
                    })
                }
            }
        });
        setTimeout(()=> {
            return resolve(arr);
        }, 1000)
    })
}

router.post('/add', (req,res)=> {
    const token = req.body.token;
    const amount = req.body.amount;
    jwt.verify(token, 'SECRET_KEY', (err, result)=> {
        if(err) res.json({
            message: 'error occurred'
        })
        else {
            client.hgetall(result.username, function (e, r) {
                let newObj = r;
                if (newObj.purchases) {
                    const newArr = JSON.parse(newObj.purchases);
                    newArr.push({
                        amount: amount
                    })
                    newObj.purchases = JSON.stringify(newArr)
                    client.hmset(result.username, newObj);
                    client.hgetall(result.username, (er, re) => {
                        res.json({
                            result: JSON.parse(re.purchases)
                        })
                    })
                } else {
                    newObj.purchases = JSON.stringify([{
                        amount: amount
                    }])
                    client.hmset(result.username, newObj);
                    client.hgetall(result.username, (er, re) => {
                        res.json({
                            result: JSON.parse(re.purchases)
                        })
                    })
                }
            })
        }
    })
})

module.exports = router;

