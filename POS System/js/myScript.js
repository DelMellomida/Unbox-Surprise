var count = 1;
var userArray = [["admin", "1234"]];
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

    for (var i = 0; i < userArray.length; i++) {
        if (username === userArray[i][0] && password === userArray[i][1]) {
            window.location.href = "home.html";
        } else {
            alert("Incorrect Username Or Password");
            count++;
        }
    }
}

function register() {
    var username = document.getElementById("username").value;
    var password = document.getElementById("password").value;
    userArray.push([username, password]);
}

document.addEventListener("DOMContentLoaded", function () {
    var form = document.getElementById("loginForm");
    form.addEventListener("submit", function (event) {
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

document.addEventListener("DOMContentLoaded", function () {
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

document.addEventListener("DOMContentLoaded", function () {
    const addToCartButtons = document.querySelectorAll('.actions-wrapper .cart');

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productContainer = button.parentElement.parentElement;
            const productName = productContainer.querySelector('.info .title').textContent;
            const priceContainer = productContainer.querySelector('.info .price');
            const price = parseFloat(priceContainer.textContent.split(' ')[1]);
            const imageSrc = productContainer.querySelector('.img-wrapper img').getAttribute('src');

            const existingProduct = cart.find(item => item.name === productName);
            if (existingProduct) {
                existingProduct.quantity++;
            } else {
                cart.push({
                    name: productName,
                    price: price,
                    quantity: 1,
                    image: imageSrc
                });
            }

            populateCartPopup();
            updateTotalPrice();
            updateCartCount();
        });
    });
});

function populateCartPopup() {
    const cartItemsList = document.getElementById('cart-items');
    cartItemsList.innerHTML = '';

    cart.forEach(item => {
        const cartItemElement = document.createElement('li');
        cartItemElement.classList.add('cart-item');

        const productImage = document.createElement('img');
        productImage.src = item.image;
        productImage.alt = item.name;
        productImage.classList.add('product-image');
        cartItemElement.appendChild(productImage);

        const productDetails = document.createElement('div');
        productDetails.classList.add('product-details');

        const productName = document.createElement('div');
        productName.textContent = item.name;
        productName.classList.add('product-name');
        productDetails.appendChild(productName);

        const productPrice = document.createElement('div');
        productPrice.textContent = `Price: Php ${item.price}`;
        productPrice.classList.add('product-price');
        productDetails.appendChild(productPrice);

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
            updateCartCount();
        });

        const increaseButton = document.createElement('button');
        increaseButton.textContent = '+';
        increaseButton.classList.add('quantity-increase');
        increaseButton.addEventListener('click', () => {
            item.quantity++;
            populateCartPopup();
            updateTotalPrice();
            updateCartCount();
        });

        const quantityText = document.createElement('span');
        quantityText.classList.add('quantity-text');
        quantityText.textContent = item.quantity;

        quantityContainer.appendChild(decreaseButton);
        quantityContainer.appendChild(quantityText);
        quantityContainer.appendChild(increaseButton);

        const buttonsContainer = document.createElement('div');
        buttonsContainer.classList.add('buttons-container');
        buttonsContainer.appendChild(quantityContainer);

        productDetails.appendChild(buttonsContainer);

        const productDeleteButton = document.createElement('span');
        productDeleteButton.innerHTML = '<i class="fas fa-trash-alt delete-item"></i>';
        productDeleteButton.addEventListener('click', () => {
            cart = cart.filter(cartItem => cartItem !== item);
            populateCartPopup();
            updateTotalPrice();
            updateCartCount();
        });

        cartItemElement.appendChild(productDetails);
        cartItemsList.appendChild(cartItemElement);
        cartItemElement.appendChild(productDeleteButton);
    });
}

function showNotification(message) {
    const notification = document.getElementById('notification');
    notification.textContent = message;
    notification.classList.remove('hidden');

    setTimeout(() => {
        notification.classList.add('hidden');
    }, 2000);
}

var cartBtn = document.querySelector(".cart-btn");
var cancelBtn = document.querySelector(".cancel-btn");
var menuItems = document.querySelectorAll(".menu-item");
var cartPopup = document.querySelector(".cart-summary");
var checkOutBtn = document.querySelector(".checkOutBtn");
var checkOutContainer = document.querySelector(".checkout-container");
var cancelCheckoutBtn = document.querySelector(".cancelCheckout-btn");

cartBtn.onclick = function () {
    cartBtn.style.display = "none";
    cancelBtn.style.display = "flex";
    menuItems.forEach(item => {
        item.style.display = "none";
    });
    cartPopup.style.display = "block";
    populateCartPopup();
}

cancelBtn.onclick = function () {
    cancelBtn.style.display = "none";
    cartBtn.style.display = "flex";
    menuItems.forEach(item => {
        item.style.display = "block";
    });
    cartPopup.style.display = "none";
}

checkOutBtn.onclick = function () {
    if (calculateTotalPrice().toFixed(2) !== '0.00') {
        checkOutContainer.classList.remove("hidden");
        copyCartSummary();
    } else {
        alert('There is no item in the cart');
    }
}

cancelCheckoutBtn.onclick = function () {
    checkOutContainer.classList.add("hidden");

    var orderList = document.querySelector(".order-list");
    orderList.innerHTML = '';

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
    const totalPrice = cart.reduce((total, item) => total + item.price * item.quantity, 0);
    document.getElementById('cart-total').textContent = totalPrice.toFixed(2);
}

function updateCartCount() {
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = cartCount;
}

updateTotalPrice();

function bought() {
    var name = checkOutContainer.querySelector('.checkout .table-layout .name').value;
    var address = checkOutContainer.querySelector('.checkout .table-layout .address').value;
    if (name === "" || address === "") {
        alert("Please input all required fields.")
    }
    else {
        if (calculateTotalPrice().toFixed(2) !== '0.00') {
            alert('Items Bought Successfully');
            cart = [];
            populateCartPopup();
            updateTotalPrice();
            updateCartCount();
            userName = name;
            userAddress = address;
        } else {
            alert('There is no item in the cart');
        }
    }
    checkOutContainer.classList.add("hidden");
}

function toggleCartSummary() {
    const cartSummary = document.getElementById('cart-summary');
    cartSummary.classList.toggle('show');
}

function copyCartSummary() {
    const cartSummary = document.getElementById('cart-summary');
    const checkoutContainer = document.querySelector('.checkout-container .order-list');
    const cartItemsList = cartSummary.querySelector('#cart-items').cloneNode(true);

    const totalCheckout = document.getElementById("totalCheckout");
    totalCheckout.innerHTML = "Php " + document.getElementById("cart-total").textContent;

    const total = document.getElementById("totalOverall");
    const delivery = document.getElementById("delivery");

    const totalCheckoutValue = parseFloat(totalCheckout.textContent.replace("Php", "").trim());
    const deliveryValue = parseFloat(delivery.textContent.replace("Php", "").trim());

    const sum = totalCheckoutValue + deliveryValue;

    total.innerHTML = "Php " + sum.toFixed(2);

    checkoutContainer.appendChild(cartItemsList);
}

function updateCheckoutInfo() {
    var select = document.getElementById('payment-method');
    var image = document.getElementById('credit-card-image');
    var cardNumberLabel = document.getElementById('card-number-label');
    var cardHolderLabel = document.getElementById('card-holder-label');
    var cardNumberInput = document.getElementById('card-number');
    var cardHolderInput = document.getElementById('card-holder');
    var expiration = document.getElementById('expiration');
    var cvc = document.getElementById('cvc');
    var expirationLabel = document.getElementById('expiration-label');
    var cvcLabel = document.getElementById('cvc-label');
    var name = document.getElementById('name');
    var address = document.getElementById('address');
    var nameLabel = document.getElementById('name-label');
    var addressLabel = document.getElementById('address-label');

    select.addEventListener('change', function () {
        var selectedValue = select.value;

        switch (selectedValue) {
            case 'visa':
                image.src = '/assets/visa.png';
                cardNumberLabel.style.visibility = "visible";
                cardHolderLabel.style.visibility = "visible";
                cardNumberInput.style.visibility = "visible";
                cardHolderInput.style.visibility = "visible";
                nameLabel.style.visibility = "visible";
                addressLabel.style.visibility = "visible";
                name.style.visibility = "visible";
                address.style.visibility = "visible";
                expirationLabel.style.visibility = "visible";
                cvcLabel.style.visibility = "visible";
                expiration.style.visibility = "visible";
                cvc.style.visibility = "visible";
                break;
            case 'mastercard':
                image.src = '/assets/mastercard.png';
                cardNumberLabel.style.visibility = "visible";
                cardHolderLabel.style.visibility = "visible";
                cardNumberInput.style.visibility = "visible";
                cardHolderInput.style.visibility = "visible";
                nameLabel.style.visibility = "visible";
                addressLabel.style.visibility = "visible";
                name.style.visibility = "visible";
                address.style.visibility = "visible";
                expirationLabel.style.visibility = "visible";
                cvcLabel.style.visibility = "visible";
                expiration.style.visibility = "visible";
                cvc.style.visibility = "visible";
                break;
            case 'gcash':
                image.src = '/assets/gcash.png';
                cardNumberLabel.style.visibility = "hidden";
                cardHolderLabel.style.visibility = "hidden";
                cardNumberInput.style.visibility = "hidden";
                cardHolderInput.style.visibility = "hidden";
                nameLabel.style.visibility = "visible";
                addressLabel.style.visibility = "visible";
                name.style.visibility = "visible";
                address.style.visibility = "visible";
                expirationLabel.style.visibility = "hidden";
                cvcLabel.style.visibility = "hidden";
                expiration.style.visibility = "hidden";
                cvc.style.visibility = "hidden";
                break;
            case 'cash':
                image.src = '/assets/peso.png';
                cardNumberLabel.style.visibility = "hidden";
                cardHolderLabel.style.visibility = "hidden";
                cardNumberInput.style.visibility = "hidden";
                cardHolderInput.style.visibility = "hidden";
                nameLabel.style.visibility = "visible";
                addressLabel.style.visibility = "visible";
                name.style.visibility = "visible";
                address.style.visibility = "visible";
                expirationLabel.style.visibility = "hidden";
                cvcLabel.style.visibility = "hidden";
                expiration.style.visibility = "hidden";
                cvc.style.visibility = "hidden";
                break;
            default:
                break;
        }
    });
}

updateCheckoutInfo();

function processCheckout() {
    var name = document.getElementById('name').value;
    var address = document.getElementById('address').value;
    if (name && address) {
        document.querySelector('.checkout-container').classList.add('hidden');
        document.querySelector('.success-message').classList.remove('hidden');
        cancelBtn.style.display = "none";
        cartBtn.style.display = "flex";
        menuItems.forEach(item => {
            item.style.display = "block";
        });
        cartPopup.style.display = "none";
        var orderInCart = document.getElementById("cart-items");
        while (orderInCart.firstChild) {
            orderInCart.removeChild(orderInCart.firstChild);
        }
        var orderList = document.querySelector(".order-list");
        orderList.innerHTML = '';

        setTimeout(() => {
            document.querySelector('.success-message').classList.add('hidden');
        }, 5000);
    } else {
        alert('Please fill in at least the name and address fields');
    }
}

