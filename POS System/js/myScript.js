var count = 1;
var userArray = [["Jhondel", "1234"]];

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
        popOutContainer.style.opacity = '1'; // Show the pop-out container
    });

    container.addEventListener('mouseleave', () => {
        const popOutContainer = container.querySelector('.pop-out-box');
        popOutContainer.style.opacity = '0'; // Hide the pop-out container
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
    const cartItemsList = document.querySelector('.cart-items');
    cartItemsList.innerHTML = '';

    cart.forEach(item => {
        const cartItemElement = document.createElement('li');
        
        const quantityContainer = document.createElement('div');
        quantityContainer.classList.add('quantity-container');
        
        const decreaseButton = document.createElement('button');
        decreaseButton.textContent = '-';
        decreaseButton.classList.add('decrease-button');
        decreaseButton.addEventListener('click', () => {
            if (item.quantity > 1) {
                item.quantity--;
                populateCartPopup();
                updateTotalPrice();
            }
        });
        
        const quantityText = document.createElement('span');
        quantityText.textContent = item.quantity;
        quantityText.classList.add('quantity-text');
        
        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.classList.add('increase-button');
        increaseButton.addEventListener('click', () => {
            item.quantity++;
            populateCartPopup();
            updateTotalPrice();
        });
        
        quantityContainer.appendChild(decreaseButton);
        quantityContainer.appendChild(quantityText);
        quantityContainer.appendChild(increaseButton);
        
        cartItemElement.textContent = `${item.name} - ${item.options ? item.options + ' ' : ''}Php ${item.price} `;
        cartItemElement.appendChild(quantityContainer);
        
        cartItemsList.appendChild(cartItemElement);
    });
}


var cartBtn = document.querySelector(".cart-btn");
var cancelBtn = document.querySelector(".cancel-btn");
var menuItems = document.querySelectorAll(".menu-item");
var cartPopup = document.querySelector(".cart-popup"); 

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


function calculateTotalPrice() {
    let totalPrice = 0;

    cart.forEach(item => {
        totalPrice += item.price * item.quantity;
    });

    return totalPrice;
}

function updateTotalPrice() {
        const totalElement = document.querySelector('.cart-popup h3');
        totalElement.textContent = `Total: Php ${calculateTotalPrice().toFixed(2)}`;
}

updateTotalPrice();

function bought() {
    if (calculateTotalPrice().toFixed(2) !== '0.00') {
        alert('Items Bought Successfully');
        cart = []; 
        populateCartPopup();
        updateTotalPrice();
    } else {
        alert('There is no item in the cart');
    }
}
