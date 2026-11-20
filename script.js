const products = [
  {id:1,name:'Essential Oversized Tee',category:'Shirts',price:699,emoji:'👕',color:'#e7e1d6',tag:'BEST SELLER'},
  {id:2,name:'Midnight Graphic Tee',category:'Shirts',price:799,emoji:'👕',color:'#d4d8dc',tag:'NEW'},
  {id:3,name:'Everyday Pullover Hoodie',category:'Hoodies',price:1499,emoji:'🧥',color:'#d6d9cb',tag:'POPULAR'},
  {id:4,name:'Street Classic Hoodie',category:'Hoodies',price:1599,emoji:'🧥',color:'#d8cfc6',tag:'NEW'},
  {id:5,name:'Urban Canvas Cap',category:'Accessories',price:449,emoji:'🧢',color:'#e0d8e7',tag:'ESSENTIAL'},
  {id:6,name:'Daily Carry Backpack',category:'Accessories',price:999,emoji:'🎒',color:'#d2dfd9',tag:'LIMITED'}
];
const peso = amount => '₱' + amount.toLocaleString('en-PH');
const productGrid = document.getElementById('productGrid');
const cart = {};
function renderProducts(category='All') {
  productGrid.innerHTML = products.filter(p => category==='All'||p.category===category).map(p=>`
    <article class="product-card"><div class="product-art" style="background:${p.color}"><span class="product-tag">${p.tag}</span><span class="product-emoji" role="img" aria-label="${p.category}">${p.emoji}</span></div>
    <div class="product-info"><div><h3>${p.name}</h3><p>${p.category} · Urban Threads</p></div><span class="price">${peso(p.price)}</span></div>
    <button class="add-button" data-add="${p.id}">+ ADD TO BAG</button></article>`).join('');
}
function renderCart(){
  const entries=Object.entries(cart).filter(([,qty])=>qty>0);
  const count=entries.reduce((n,[,qty])=>n+qty,0);
  document.getElementById('cartCount').textContent=count;
  document.getElementById('cartTitleCount').textContent=`(${count})`;
  document.getElementById('cartTotal').textContent=peso(entries.reduce((sum,[id,qty])=>sum+products.find(p=>p.id===Number(id)).price*qty,0));
  document.getElementById('cartItems').innerHTML=entries.length?entries.map(([id,qty])=>{
    const p=products.find(p=>p.id===Number(id));
    return `<div class="cart-item"><div><strong>${p.name}</strong><small>${peso(p.price)} each</small></div><div class="qty-controls"><button data-change="${id}" data-delta="-1" aria-label="Remove one ${p.name}">−</button><span>${qty}</span><button data-change="${id}" data-delta="1" aria-label="Add one ${p.name}">+</button></div></div>`;
  }).join(''):'<p class="empty-cart">Your bag is empty. Find something you love!</p>';
}
function toggleCart(open){document.getElementById('cartPanel').hidden=!open;document.getElementById('overlay').hidden=!open;document.body.style.overflow=open?'hidden':'';if(open)document.getElementById('closeCart').focus();else document.getElementById('cartButton').focus();}
document.addEventListener('click',event=>{
  const add=event.target.closest('[data-add]');if(add){const id=add.dataset.add;cart[id]=(cart[id]||0)+1;renderCart();toggleCart(true);}
  const change=event.target.closest('[data-change]');if(change){const id=change.dataset.change;cart[id]=Math.max(0,(cart[id]||0)+Number(change.dataset.delta));renderCart();}
  const filter=event.target.closest('[data-category]');if(filter){document.querySelectorAll('.filter').forEach(b=>{const active=b===filter;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active));});renderProducts(filter.dataset.category);}
});
document.getElementById('cartButton').addEventListener('click',()=>toggleCart(true));
document.getElementById('closeCart').addEventListener('click',()=>toggleCart(false));
document.getElementById('overlay').addEventListener('click',()=>toggleCart(false));
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!document.getElementById('cartPanel').hidden)toggleCart(false);});
document.getElementById('menuToggle').addEventListener('click',()=>{const nav=document.getElementById('mainNav');const open=nav.classList.toggle('open');document.getElementById('menuToggle').setAttribute('aria-expanded',String(open));});
document.querySelectorAll('#mainNav a').forEach(a=>a.addEventListener('click',()=>{document.getElementById('mainNav').classList.remove('open');document.getElementById('menuToggle').setAttribute('aria-expanded','false');}));
document.getElementById('contactForm').addEventListener('submit',event=>{event.preventDefault();const name=document.getElementById('name').value.trim(),email=document.getElementById('email').value.trim(),message=document.getElementById('message').value.trim();const subject=encodeURIComponent(`Urban Threads inquiry from ${name}`),body=encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);window.location.href=`mailto:?subject=${subject}&body=${body}`;});
renderProducts();renderCart();
