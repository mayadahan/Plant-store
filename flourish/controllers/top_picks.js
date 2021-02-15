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
                res.render('welcome', {
                    message: ''
                })
            }
            else{
                client.hgetall('admin', (er, re) => {
                    if(er){
                        res.render('top_picks', {
                            result: ''
                        })
                    } else if(re.items && re.items.constructor === Array && re.items.length === 0){
                        res.render('top_picks', {
                            result: ''
                        })
                    } else {
                        if(re.items){
                            res.render('top_picks', {
                                result: JSON.parse(re.items)
                            })
                        } else {
                            res.render('top_picks', {
                                result: ''
                            })
                        }
                    }
                })
            }
        })
    } else {
        client.hgetall('admin', (er, re) => {
            if(er){
                res.render('welcome', {
                    result: ''
                })
            } else if(re.items && re.items.constructor === Array && re.items.length === 0){
                res.render('welcome', {
                    result: ''
                })
            } else {
                if(re.items){
                    res.render('welcome', {
                        result: JSON.parse(re.items)
                    })
                } else {
                    res.render('welcome', {
                        result: ''
                    })
                }
            }
        })
    }

})

module.exports = router;
