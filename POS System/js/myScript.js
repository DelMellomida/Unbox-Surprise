var count = 1;
var userArray = [["Jhondel", "1234"]];
var userName;
var userAddress;

const productContainers = document.querySelectorAll('.box');

function login() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;

    if (count > 3) {
        alert("Number of Tries Exceeded");
        return;
    }

    for(var i = 0; i < userArray.length; i++){
        if (username === userArray[i][0] && password === userArray[i][1]) {
            window.location.href = "home.html";
        } else {
            alert("Incorrect Username Or Password");
            count++;
        }
    }
}

function register(){
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    userArray.push([username, password]);
}

document.addEventListener("DOMContentLoaded", function() {
    var form = document.getElementById("loginForm");
    form.addEventListener("submit", function(event) {
        event.preventDefault();
        login();
    });
});

productContainers.forEach(container => {
    container.addEventListener('mouseenter', () => {
        const popOutContainer = container.querySelector('.pop-out-box');
        popOutContainer.style.opacity = '1';
    });

    container.addEventListener('mouseleave', () => {
        const popOutContainer = container.querySelector('.pop-out-box');
        popOutContainer.style.opacity = '0';
    });
});

document.addEventListener("DOMContentLoaded", function() {
    const selectElements = document.querySelectorAll('.options select');
    const priceElements = document.querySelectorAll('.pop-out-box p');

    selectElements.forEach((select, index) => {
        select.addEventListener('change', () => {
            const selectedOption = select.options[select.selectedIndex];
            const price = selectedOption.value;
            priceElements[index].textContent = `Php ${price}`;
        });
    });
});

var cart = [];

document.addEventListener("DOMContentLoaded", function() {
    const addToCartButtons = document.querySelectorAll('.box button');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productContainer = button.parentElement;
            const productName = productContainer.querySelector('h2').textContent;
            const priceContainer = productContainer.querySelector('.pop-out-box p');
            const price = parseFloat(priceContainer.textContent.split(' ')[1]);

            const optionsSelect = productContainer.querySelector('.options select');
            let options = null;
            if (optionsSelect) {
                options = optionsSelect.options[optionsSelect.selectedIndex].text;
            }

            const existingProduct = cart.find(item => item.name === productName && item.options === options);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    name: productName,
                    price: price,
                    quantity: 1,
                    options: options
                });
            }

            populateCartPopup();
            updateTotalPrice();
        });
    });
});

function populateCartPopup() {
    const cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = '';

    cart.forEach(item => {
        const cartItemElement = document.createElement('li');
        cartItemElement.classList.add('cart-item');
        
        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('quantity-container');
        
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.classList.add('quantity-decrease');
        decreaseButton.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
            } else {
                cart = cart.filter(cartItem => cartItem !== item);
            }
            populateCartPopup();
            updateTotalPrice();
        });

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.classList.add('quantity-increase');
        increaseButton.addEventListener('click', () => {
            item.quantity++;
            populateCartPopup();
            updateTotalPrice();
        });

        const quantityText = document.createElement('span');
        quantityText.classList.add('quantity-text');
        quantityText.textContent = item.quantity;

        quantityContainer.appendChild(decreaseButton);
        quantityContainer.appendChild(quantityText);
        quantityContainer.appendChild(increaseButton);

        cartItemElement.textContent = `${item.name} - Php ${item.price} (${item.options}) `;
        cartItemElement.appendChild(quantityContainer);

        cartItemsList.appendChild(cartItemElement);
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 3000);
}

var cartBtn = document.querySelector(".cart-btn");
var cancelBtn = document.querySelector(".cancel-btn");
var menuItems = document.querySelectorAll(".menu-item");
var cartPopup = document.querySelector(".cart-summary"); 
var checkOutBtn = document.querySelector(".checkOutBtn"); 
var checkOutCancelBtn = document.querySelector(".cancel"); 
var checkOutContainer = document.querySelector(".checkout-container");

cartBtn.onclick = function(){
    cartBtn.style.display = "none";
    cancelBtn.style.display = "flex";
    menuItems.forEach(item => {
        item.style.display = "none";
    });
    cartPopup.style.display = "block"; 
    populateCartPopup();
}

cancelBtn.onclick = function(){
    cancelBtn.style.display = "none";
    cartBtn.style.display = "flex";
    menuItems.forEach(item => {
        item.style.display = "block";
    });
    cartPopup.style.display = "none";
}

checkOutBtn.onclick = function(){
    checkOutContainer.classList.remove("hidden");
}

checkOutCancelBtn.onclick = function(){
    checkOutContainer.classList.add("hidden");
}


function calculateTotalPrice() {
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    return totalPrice;
}

function updateTotalPrice() {
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.getElementById('cart-total').textContent = totalPrice.toFixed(2);
}

updateTotalPrice();

function bought() {
    var name = checkOutContainer.querySelector('.checkout .table-layout .name').value;
    var address = checkOutContainer.querySelector('.checkout .table-layout .address').value;
    if(name === "" || address === ""){
        alert("Please input all required fields.")
    }
    else{
        if (calculateTotalPrice().toFixed(2) !== '0.00') {
            alert('Items Bought Successfully');
            cart = []; 
            populateCartPopup();
            updateTotalPrice();
            userName = name;
            userAddress = address;
        } else {
            alert('There is no item in the cart');
        }
    }
    checkOutContainer.classList.add("hidden");
}
