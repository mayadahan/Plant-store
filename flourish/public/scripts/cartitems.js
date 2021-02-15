let tabledata = document.getElementById('tabledata');
//let cart = localStorage.getItem('cart');
//
// if (localStorage.getItem('cart') !== null && localStorage.getItem('cart') != '0') {
//     document.getElementById('cart').innerText = `CART(${localStorage.getItem('cart')})`
// }
let items = [];
for (let i = 0; i <= 50; i++){
    let data = sessionStorage.getItem(i);
    if(data !== null){
        let arr = data.split(';');
        items.push({
            name: arr[0],
            price: parseInt(arr[1])
        })
    }
}



let total = 0;

for (let i = 0; i <= items.length; i++){
    if(i === items.length){
        tabledata.innerHTML += `
        <th scope="row">${i+1}</th>
        <td>-</td>
        <td>-</td>
        <td>$${total}</td>
    `;
    } else {
        tabledata.innerHTML += `
        <th scope="row">${i+1}</th>
        <td>${items[i].name}</td>
        <td>$${items[i].price}</td>
    `;
        total += items[i].price;
    }
}

let token = document.cookie.split(';')[1].split('=')[1];

function checkout(){
    Swal.fire({
        title: 'Are you sure you want to Checkout?',
        text: `Total Price: $${total}`,
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No'
    }).then((result) => {
        if (result.value) {
            fetch(`http://${window.location.host}/purchase/add`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    token: token,
                    amount: total
                })
            }).then(result=> {
                Swal.fire(
                    'Purchase Successful',
                    'Your items will be shipped soon',
                    'success'
                ).then((result)=> {
                    sessionStorage.clear();
                    // Simulate an HTTP redirect:
                    window.location.replace(`http://${window.location.host}/dashboard`);
                })
            })
        }
    })
}
