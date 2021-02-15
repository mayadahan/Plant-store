const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const client = require('./redisConnector')
const jwt = require('jsonwebtoken');
const multer = require('multer')
const path = require('path')

router.use(bodyParser.json());
router.use(bodyParser.urlencoded({extended: false}));

// Set The Storage Engine
const storage = multer.diskStorage({
    destination: './public/uploads/',
    filename: function(req, file, cb){
        cb(null,file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

// Init Upload
const upload = multer({
    storage: storage,
    limits:{fileSize: 1000000},
    fileFilter: function(req, file, cb){
        checkFileType(file, cb);
    }
}).single('myImage');

// Check File Type
function checkFileType(file, cb){
    // Allowed ext
    const filetypes = /jpeg|jpg|png/;
    // Check ext
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    // Check mime
    const mimetype = filetypes.test(file.mimetype);

    if(mimetype && extname){
        return cb(null,true);
    } else {
        cb('Error: Images Only!');
    }
}






router.get('/', (req, res) => {
    const cookies = parseCookies(req);
    jwt.verify(cookies.token, 'SECRET_KEY', (err, result)=> {
        if(err){
            res.redirect('/');
        } else if(result.username === 'admin'){
            res.render('add_items');
        } else {
            res.redirect('/dashboard')
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
    upload(req, res, (err) => {
        if(err){
            res.redirect('/dashboard');
        } else {
            if(req.file == undefined){
                res.redirect('/dashboard');
            } else {
                const cookies = parseCookies(req);
                const itemName = req.body.itemName;
                const itemPrice = req.body.itemPrice;
                const itemDescription = req.body.itemdescription;
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
                                    price: itemPrice,
                                    desc: itemDescription,
                                    image: `${req.file.filename}`
                                })
                                newObj.items = JSON.stringify(newArr)
                                client.hmset(result.username, newObj);
                                client.hgetall(result.username, (er, re) => {
                                    res.render('allitems', {
                                        result: JSON.parse(re.items)
                                    })
                                })
                            } else {
                                newObj.items = JSON.stringify([{
                                    name: itemName,
                                    price: itemPrice,
                                    desc: itemDescription,
                                    image: `${req.file.filename}`
                                }])
                                client.hmset(result.username, newObj);
                                client.hgetall(result.username, (er, re) => {
                                    res.render('allitems', {
                                        result: JSON.parse(re.items)
                                    })
                                })
                            }
                        })
                    }
                });
                // res.render('index', {
                //     msg: 'File Uploaded!',
                //     file: `uploads/${req.file.filename}`
                // });
            }
        }
    });
});


// router.post('/', (req, res) => {
//
// })

module.exports = router;

