const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const client = require('./redisConnector')
const jwt = require('jsonwebtoken');
const Fuse = require('fuse.js');

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

router.post('/', (req,res)=> {
    const searchItem = req.body.searchItem;
    const cookies = parseCookies(req);
    jwt.verify(cookies.token, 'SECRET_KEY', (error, result)=> {
        if(error){
            res.redirect('/')
        } else {
            client.hgetall(result.username, (err, data)=> {
                if(err) {
                    res.redirect('/dashboard');
                } else if(data !== null) {
                    const parsedItems = JSON.parse(data.items);
                    const fuse = new Fuse(parsedItems, {
                        keys: ['name', 'price']
                    })
                    const searched = fuse.search(searchItem);
                    res.render('search', {
                        result: searched,
                        searchterm: searchItem
                    })
                }
            })
        }
    })

})

module.exports = router;

