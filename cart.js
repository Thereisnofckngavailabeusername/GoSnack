




let cart = [];

function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    updateCart();
}

function updateCart() {
    const cartItemsElement = document.getElementById('cartItems');
    const cartTotalElement = document.getElementById('cartTotal');
    
    cartItemsElement.innerHTML = '';
    let total = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        const li = document.createElement('li');
        li.className = 'cart-item';
        li.innerHTML = `
            <span class="cart-item-name">${item.name}</span>
            <span class="cart-item-price">€${item.price.toFixed(2)} x ${item.quantity}</span>
            <div class="cart-item-quantity">
                <button onclick="decreaseQuantity(${index})">-</button>
                <span>${item.quantity}</span>
                <button onclick="increaseQuantity(${index})">+</button>
                <button class="remove-btn" onclick="removeFromCart(${index})">Retirer</button>
            </div>
        `;
        cartItemsElement.appendChild(li);
    });
    
    cartTotalElement.textContent = `Total: €${total.toFixed(2)}`;
}

function increaseQuantity(index) {
    cart[index].quantity++;
    updateCart();
}

function decreaseQuantity(index) {
    if (cart[index].quantity > 1) {
        cart[index].quantity--;
    } else {
        removeFromCart(index);
    }
    updateCart();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCart();
}

function clearCart() {
    cart = [];
    updateCart();
    document.getElementById('message').value = '';
}

function generateOrderMessage() {
    if (cart.length === 0) {
        alert('Veuillez ajouter des produits au panier!');
        return;
    }
    
    let message = 'Bonjour, je souhaiterais passer la commande suivante:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        message += `• ${item.name} x${item.quantity} = €${itemTotal.toFixed(2)}\n`;
        total += itemTotal;
    });
    
    message += `\nTotal: €${total.toFixed(2)}\n\nMerci!`;
    

    


    document.getElementById('message').value = message;
    

    


    document.getElementById('contact').scrollIntoView({ behavior: 'smooth' });
}

function sendBySMS() {
    const nameInput = document.getElementById('name').value;
    const timeInput = document.getElementById('subject').value;
    const messageInput = document.getElementById('message').value;
    
    if (!nameInput || !timeInput || !messageInput) {
        alert('Veuillez remplir tous les champs du formulaire!');
        return;
    }
    

    


    const fullMessage = `Prénom: ${nameInput}\nHeure: ${timeInput}\n\n${messageInput}`;
    
    // Numéro de téléphone du snack (format international sans le +)
    const phoneNumber = '262692567582'; 
    
    
    // Lien WhatsApp
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(fullMessage)}`;
    
    // Lien SMS 
    const smsUrl = `sms:+${phoneNumber}?body=${encodeURIComponent(fullMessage)}`;
    



    const choice = confirm('Choisissez votre méthode:\nOK pour WhatsApp\nAnnuler pour SMS');
    
    if (choice) {
        window.open(whatsappUrl, '_blank');
    } else {
        window.location.href = smsUrl;
    }
}

function toggleCategory(header) {
    const items = header.nextElementSibling;
    const icon = header.querySelector('.toggle-icon');
    
    items.classList.toggle('open');
    icon.classList.toggle('open');
}
