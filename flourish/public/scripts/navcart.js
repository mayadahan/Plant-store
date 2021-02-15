let cart = 0;

let username = document.cookie.split(';')[0].split('=')[1];

if(sessionStorage.getItem('username') !== username){
    sessionStorage.clear()
}

// sessionStorage.clear();
if (sessionStorage.getItem('cart') !== null && sessionStorage.getItem('cart') != '0') {
    document.getElementById('cart').innerText = `CART(${sessionStorage.getItem('cart')})`
}

function addToCart(obj) {
    if (obj.innerText === 'Add to Cart') {
        if (cart >= 0) {
            sessionStorage.setItem('username', username);
            obj.innerText = 'Added to cart';
            if(sessionStorage.getItem('cartArr') !== null) sessionStorage.setItem('cartArr', `${sessionStorage.getItem('cartArr')}${obj.id}`);
            else sessionStorage.setItem('cartArr', `${obj.id}`)
            sessionStorage.setItem(obj.id, `${obj.getAttribute('data-name')};${obj.getAttribute('data-price')}`);
            document.getElementById('cart').innerText = `CART(${++cart})`
            sessionStorage.setItem('cart', cart.toString());
        }
    } else if (obj.innerText === 'Added to cart') {
        if (cart > 0) {
            const index = sessionStorage.getItem('cartArr').split('').indexOf(obj.id.toString());
            sessionStorage.removeItem(obj.id);
            if (index > -1) {
                const arr = sessionStorage.getItem('cartArr').split('');
                arr.splice(index, 1);
                sessionStorage.setItem('cartArr', arr);
            }
            document.getElementById('cart').innerText = `CART(${--cart})`
        }
        obj.innerText = 'Add to Cart';
        sessionStorage.setItem('cart', cart.toString());
    }
}


