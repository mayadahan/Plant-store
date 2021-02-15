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

router.get('/', (req,res)=> {
    let cookies = parseCookies(req);
    if(cookies.username && cookies.token){
        jwt.verify(cookies.token, 'SECRET_KEY', (err, result)=> {
            if(err){
                res.render('index', {
                    message: ''
                })
            }
            else{
                res.redirect('/dashboard');
            }
        })
    } else {
        res.render('index', {
            message: ''
        })
    }

})

router.post('/', (req,res)=> {
    const username = req.body.username;
    const password = req.body.password;
    let obj = {
        name: username,
        password: password
    }
    client.hgetall(username, (err, data)=> {
        if(err) res.redirect('/');
        else if(data !== null){
            res.render('index', {
                message: 'user with this username already exists'
            })
        } else {
            client.hmset(username, obj);
            res.render('index', {
                message: 'Registered Successfully!'
            })
        }
    })
})

module.exports = router;

