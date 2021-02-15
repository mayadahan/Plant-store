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
                res.render('signin', {
                    message: ''
                })
            }
            else{
                res.redirect('/dashboard');
            }
        })
    } else {
        res.render('signin', {
            message: ''
        })
    }

})

router.post('/', (req,res)=> {
    // let cookies = parseCookies(req);
    const username = req.body.username;
    const password = req.body.password;
    client.hgetall(`${username}`, (error, data)=> {
        // console.log(data)
        if(data !== null && data.password.toString() === password){
            jwt.sign({username}, 'SECRET_KEY', {expiresIn: '30m'}, (err, token)=> {
                if(err) console.log(err);
                res.cookie('username', username, {maxAge: 1800000, httpOnly: true});
                res.cookie('token', token, {maxAge: 1800000, httpOnly: true});
                client.hgetall(username, (er, re) => {
                    if(re.name === 'admin' && re.password === 'admin'){
                        res.redirect('/dashboard')
                    } else {
                        if(er){
                            res.render('dashboard', {
                                result: ''
                            })
                        } else if(re && re.constructor === Array && re.items.length === 0){
                            res.redirect('/')
                        } else {
                            res.redirect('/dashboard')
                        }
                    }
                })
            })
        } else {
            res.render('signin', {
                message: 'Incorrect username or password'
            })
        }
    })
})

router.get('/user', (req,res)=> {
    res.cookie('token', '');
    res.cookie('username', '');
    res.redirect('/');
})

module.exports = router;

