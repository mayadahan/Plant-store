const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const client = require('./redisConnector')
const jwt = require('jsonwebtoken');

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

router.get('/', (req, res) => {
    const cookies = parseCookies(req);
    jwt.verify(cookies.token, 'SECRET_KEY', (err, result)=> {
        if(err){
            res.redirect('/');
        } else {
            res.render('add_items');
        }
    })
})

function parseCookies(request) {
    let list = {},
        rc = request.headers.cookie;

    rc && rc.split(';').forEach(function (cookie) {
        let parts = cookie.split('=');
        list[parts.shift().trim()] = decodeURI(parts.join('='));
    });

    return list;
}

router.post('/', (req, res) => {
    const cookies = parseCookies(req);
    const itemName = req.body.itemName;
    const itemPrice = req.body.itemPrice;
    jwt.verify(cookies.token, 'SECRET_KEY', (err, result) => {
        if (err) {
            res.render('login', {
                message: 'You have to login first'
            })
        } else {
            client.hgetall(result.username, function (e, r) {
                let newObj = r;
                if (newObj.items) {
                    const newArr = JSON.parse(newObj.items);
                    newArr.push({
                        name: itemName,
                        price: itemPrice
                    })
                    newObj.items = JSON.stringify(newArr)
                    client.hmset(result.username, newObj);
                    client.hgetall(result.username, (er, re) => {
                        res.render('dashboard', {
                            result: JSON.parse(re.items)
                        })
                    })
                } else {
                    newObj.items = JSON.stringify([{
                        name: itemName,
                        price: itemPrice
                    }])
                    client.hmset(result.username, newObj);
                    client.hgetall(result.username, (er, re) => {
                        res.render('dashboard', {
                            result: JSON.parse(re.items)
                        })
                    })
                }
            })
        }
    });
})

module.exports = router;

