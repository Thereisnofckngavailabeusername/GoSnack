




let cart = [];

function addToCart(productName, price, category) {
    // store items with category to differentiate Pain / Panini / etc.
    const existingItem = cart.find(item => item.name === productName && item.category === (category || ''));

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({
            name: productName,
            category: category || '',
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
            <span class="cart-item-name">${item.category ? item.category + ' - ' : ''}${item.name}</span>
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
    // update header counter
    updateCounter();
    // update counters on product cards
    updateProductCounters();
}



function getToButtonGenerate() {
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
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

// update small header counter showing total items
function updateCounter() {
    const counterEl = document.getElementById('cartCount');
    if (!counterEl) return;
    const totalItems = cart.reduce((s, it) => s + (it.quantity || 0), 0);
    counterEl.textContent = totalItems;
    const badge = document.getElementById('cartBadge');
    if (badge) {
        badge.classList.add('badge-pop');
        setTimeout(() => badge.classList.remove('badge-pop'), 350);
    }
}

// visual feedback on "Ajouter" clicks (small button flash)
document.addEventListener('click', function(e) {
    const btn = e.target.closest('button');
    if (!btn) return;
    const txt = (btn.textContent || '').trim().toLowerCase();
    if (txt.startsWith('ajouter')) {
        btn.classList.add('btn-added');
        setTimeout(() => btn.classList.remove('btn-added'), 300);
            // determine product name, price and category from button dataset or surrounding card
            let name = btn.getAttribute('data-name');
            let price = btn.getAttribute('data-price');
            let category = btn.getAttribute('data-category');
            const card = btn.closest('.product-card');
            if (card) {
                if (!name) {
                    const h = card.querySelector('h4');
                    if (h) name = h.textContent.trim();
                }
                if (!price) {
                    const p = card.querySelector('.price');
                    if (p) {
                        const raw = p.textContent.replace(/[^0-9.,]/g, '').replace(',', '.');
                        price = parseFloat(raw) || 0;
                    }
                }
                if (!category) {
                    const menuCat = card.closest('.menu-category');
                    if (menuCat) {
                        const ch = menuCat.querySelector('.category-header h3');
                        if (ch) category = ch.textContent.trim();
                    }
                }
            }
            if (name) {
                addToCart(name, parseFloat(price) || 0, category || '');
                showToast(`${name} ajouté au panier`);
            }
    }
});

// update product counters shown on each product card
function updateProductCounters() {
    const cards = document.querySelectorAll('.product-card');
    cards.forEach(card => {
        const h = card.querySelector('h4');
        if (!h) return;
        const name = h.textContent.trim();
        let category = '';
        const menuCat = card.closest('.menu-category');
        if (menuCat) {
            const ch = menuCat.querySelector('.category-header h3');
            if (ch) category = ch.textContent.trim();
        }
        const item = cart.find(i => i.name === name && i.category === category);
        let badge = card.querySelector('.product-counter');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'product-counter';
            const info = card.querySelector('.product-info');
            if (info) info.insertBefore(badge, info.firstChild);
        }
        badge.textContent = item ? `x${item.quantity}` : '';
        badge.style.display = item ? 'inline-block' : 'none';
    });
}

// simple toast notification
function showToast(text) {
    const t = document.createElement('div');
    t.className = 'gs-toast';
    t.textContent = text;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('visible'));
    setTimeout(() => t.classList.remove('visible'), 1500);
    setTimeout(() => t.remove(), 1900);
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

// initialize counters on load
document.addEventListener('DOMContentLoaded', function() {
    updateCart();
    updateCounter();
    updateProductCounters();
});
