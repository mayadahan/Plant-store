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

router.get('/', (req,res)=> {
    let arr = [];
    let cookies = parseCookies(req);
    if(cookies.username && cookies.token){
        jwt.verify(cookies.token, 'SECRET_KEY', (err1, result)=> {
            if(err1){
                res.render('index', {
                    message: ''
                })
            }
            else if(result.username === 'admin'){
                accumlate().then(ress => {
                    res.render('admin', {
                        result: ress
                    })
                })
            } else {
                client.hgetall(cookies.username, (er, re) => {
                    if(er){
                        res.render('dashboard', {
                            result: ''
                        })
                    } else if(re.items && re.items.constructor === Array && re.items.length === 0){
                        res.render('dashboard', {
                            result: ''
                        })
                    } else {
                        if(re.items){
                            res.render('dashboard', {
                                result: JSON.parse(re.items)
                            })
                        } else {
                            res.render('dashboard', {
                                result: ''
                            })
                        }
                    }
                })
            }
        })
    } else {
        res.render('index', {
            message: ''
        })
    }

})

module.exports = router;

