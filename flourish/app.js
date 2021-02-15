const express = require('express');
const bodyParser = require('body-parser');
const app = express();

//Routes
const loginRoute = require('./controllers/login');
const registerRoute = require('./controllers/signup');
const dashboardRoute = require('./controllers/panel');
const addItems = require('./controllers/insertitems');
const cartItems = require('./controllers/cartitems');
const searchItems = require('./controllers/filter');
const allitems = require('./controllers/viewallitems');
const purchase = require('./controllers/checkout');
const welcome = require('./controllers/welcome');
const topPicks = require('./controllers/top_picks')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static('public'))
app.set('view engine', 'ejs');

app.use('/', welcome)
app.use('/login', loginRoute);
app.use('/signup', registerRoute);
app.use('/dashboard', dashboardRoute);
app.use('/additems', addItems);
app.use('/cartitems', cartItems);
app.use('/logout', loginRoute);
app.use('/search', searchItems);
app.use('/admin', allitems);
app.use('/purchase', purchase);
app.use('/toppicks', topPicks);

const PORT = 3000;
app.listen(PORT, ()=> {
    console.log(`SERVER HAS STARTED ON PORT: ${PORT}`);
    // client.get('admin', (err, data)=> console.log(data));
})
