// Global cart array
let cart = [];

const searchProducts = () => {
    fetch("https://mahi-b-rahaman.github.io/UrbanBengal-API/UrbanBengal.json")
        .then(res => res.json())
        .then(data => showDetails(data.mensDresses))
}

searchProducts()

const showDetails=(products)=>{
    products.forEach(element => {
        const div=document.createElement("div")
        div.innerHTML=`
        <div class="group bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-indigo-500/20 h-[500px] flex flex-col">
            <div class="relative overflow-hidden h-[280px]">
                <img src="${element.productImage}"
                    alt="${element.title}" class="w-full h-full object-cover transform transition-transform duration-500 group-hover:scale-110">
                <div class="absolute inset-0 bg-gradient-to-t from-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </div>
            <div class="p-6 flex flex-col flex-grow">
                <h3 class="text-xl font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-indigo-600 transition-colors">${element.title}</h3>
                <div class="flex items-center justify-between mb-2">
                    <span class="text-yellow-500 font-medium">Rating: ${element.rating}</span>
                    <span class="text-slate-600 text-sm">${element.numberOfBuyers} buyers</span>
                </div>
                <p class="text-slate-600 mb-4 line-clamp-3 text-sm flex-grow">${element.description}</p>
                <div class="flex items-center justify-between mt-auto">
                    <p class="text-2xl font-bold text-indigo-600">৳ ${element.price}</p>
                    <button onclick="addToCart(${JSON.stringify(element).replace(/"/g, '&quot;')})" 
                            class="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-full text-sm font-medium transition-all duration-300 hover:scale-105 hover:shadow-lg hover:shadow-indigo-500/50">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
        `
        const details= document.getElementById("display-card")
        details.appendChild(div)
    });
}

// Add to cart functionality
function addToCart(product) {
    // Check if product already exists in cart
    const existingItem = cart.find(item => item.title === product.title);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }
    
    // Update cart display
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const details = document.getElementById('details');
    const totalProducts = document.getElementById('total-products');
    const price = document.getElementById('price');
    const deliveryCharge = document.getElementById('delivery-charge');
    const total = document.getElementById('total');
    
    // Clear current display
    details.innerHTML = '';
    
    // Calculate totals
    let totalItems = 0;
    let totalPrice = 0;
    
    cart.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        
        // Add item to cart display
        const itemDiv = document.createElement('div');
        itemDiv.className = 'flex justify-between items-center text-slate-800 py-2 border-b border-slate-200';
        itemDiv.innerHTML = `
            <div>
                <h4 class="font-medium">${item.title}</h4>
                <p class="text-sm">৳ ${item.price} x ${item.quantity}</p>
            </div>
            <button onclick="removeFromCart('${item.title}')" class="text-red-500 hover:text-red-600">
                Remove
            </button>
        `;
        details.appendChild(itemDiv);
    });
    
    // Update totals
    totalProducts.textContent = totalItems;
    price.textContent = totalPrice.toFixed(2);
    
    // Calculate delivery charge
    let delivery = 0;
    if (totalPrice > 500 && totalPrice < 800) {
        delivery = 50;
    } else if (totalPrice >= 800) {
        delivery = 100;
    }
    deliveryCharge.textContent = delivery;
    
    // Update total
    total.textContent = (totalPrice + delivery).toFixed(2);
}

// Remove item from cart
function removeFromCart(productTitle) {
    const itemIndex = cart.findIndex(item => item.title === productTitle);
    if (itemIndex !== -1) {
        if (cart[itemIndex].quantity > 1) {
            cart[itemIndex].quantity -= 1;
        } else {
            cart = cart.filter(item => item.title !== productTitle);
        }
        updateCartDisplay();
    }
}

// Remove all items from cart
function removeAllItems() {
    // Clear cart array
    cart = [];
    
    // Update cart display
    updateCartDisplay();
}

// Initialize cart display on page load
document.addEventListener('DOMContentLoaded', () => {
    updateCartDisplay();
});

const orderProducts = () => {
    const details = document.getElementById('details');
    const totalPrice = document.getElementById('total').innerText;
    
    // Clear cart
    cart = [];
    
    // Show order confirmation
    details.innerHTML = `
        <div class="text-center py-4">
            <h4 class="text-xl font-semibold text-slate-800 mb-2">Order Placed Successfully!</h4>
            <p class="text-slate-600">Total Amount: ৳ ${totalPrice}</p>
            <p class="text-slate-600 mt-2">Thanks for Shopping With Us!</p>
        </div>
    `;
    
    // Reset totals
    document.getElementById('total-products').textContent = '0';
    document.getElementById('price').textContent = '0';
    document.getElementById('delivery-charge').textContent = '0';
    document.getElementById('total').textContent = '0';
}

// Add coupon code functionality
function applyCoupon() {
    const couponInput = document.getElementById('coupon-code');
    const couponCode = couponInput.value.trim();
    const total = document.getElementById('total');

    const couponApplied = localStorage.getItem('couponApplied');
    const totalPrice = parseFloat(total.textContent);

    if (couponCode === 'TOOLS' && totalPrice > 1000 && !couponApplied) {
        localStorage.setItem('couponApplied', true);

        const discountedPrice = totalPrice * 0.9; // Apply 10% discount
        total.textContent = discountedPrice.toFixed(2);
        alert('Coupon applied successfully! 10% discount has been added.');
    } else if (couponApplied) {
        alert('You have already used the coupon code. Please try again.');
    } else {
        alert('Invalid coupon code or Does not meet the requirements. Please try again.');
    }

    // Clear the input field
    couponInput.value = '';
}
