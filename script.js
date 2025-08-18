// Demo-produkter (streetwear vibe)
const PRODUCTS = [
  { id:1, title:"Oversized Hoodie Black", cat:"Unisex", type:"Hoodie", price:699, tag:"Nyhet",
    img:"https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop", pop:96, date:"2025-08-01" },
  { id:2, title:"Classic White Tee", cat:"Unisex", type:"T-shirt", price:199,
    img:"https://images.unsplash.com/photo-1521335629791-ce4aec67dd47?q=80&w=1200&auto=format&fit=crop", pop:90, date:"2025-07-21" },
  { id:3, title:"Cargo Pants Olive", cat:"Herr", type:"Byxor", price:899, tag:"Trend",
    img:"https://images.unsplash.com/photo-1543555037-397fe263afd0?q=80&w=1200&auto=format&fit=crop", pop:88, date:"2025-07-28" },
  { id:4, title:"Ribbed Tank Dress", cat:"Dam", type:"Klänning", price:649,
    img:"https://images.unsplash.com/photo-1520975954732-35dd222996ad?q=80&w=1200&auto=format&fit=crop", pop:84, date:"2025-06-30" },
  { id:5, title:"Tech Shell Jacket", cat:"Unisex", type:"Jacka", price:1299, tag:"Limited",
    img:"https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1200&auto=format&fit=crop", pop:91, date:"2025-08-06" },
  { id:6, title:"Canvas Sneaker Low", cat:"Sneakers", type:"Skor", price:899,
    img:"https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=1200&auto=format&fit=crop", pop:93, date:"2025-07-14" },
  { id:7, title:"Relaxed Fit Jeans", cat:"Herr", type:"Jeans", price:799,
    img:"https://images.unsplash.com/photo-1520962918287-7448c2878f65?q=80&w=1200&auto=format&fit=crop", pop:82, date:"2025-06-25" },
  { id:8, title:"Puffer Vest Sand", cat:"Dam", type:"Väst", price:999,
    img:"https://images.unsplash.com/photo-1512436991641-6745cdb1723f?q=80&w=1200&auto=format&fit=crop", pop:79, date:"2025-06-18" },
];

// Helpers
const SEK = n => `${n.toLocaleString('sv-SE')} kr`;
const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => Array.from(root.querySelectorAll(s));

const grid = $('#grid');
const searchInput = $('#search');
const sortSel = $('#sort');
const drawer = $('#drawer');
const cartBtn = $('#cartBtn');
const closeDrawer = $('#closeDrawer');
const drawerCloseBtn = $('#drawerCloseBtn');
const cartList = $('#cartList');
const cartCount = $('#cartCount');
const cartTotal = $('#cartTotal');

let cart = JSON.parse(localStorage.getItem('streetlab-cart') || '[]');
let state = { cat:'alla', query:'', sort:'pop' };

function renderProducts(){
  let items = [...PRODUCTS];

  // filter by category
  if(state.cat !== 'alla'){
    items = items.filter(p => p.cat === state.cat || p.type === state.cat);
  }
  // search
  const q = state.query.trim().toLowerCase();
  if(q) {
    items = items.filter(p => `${p.title} ${p.cat} ${p.type}`.toLowerCase().includes(q));
  }
  // sort
  if(state.sort === 'low') items.sort((a,b)=> a.price - b.price);
  else if(state.sort === 'high') items.sort((a,b)=> b.price - a.price);
  else if(state.sort === 'new') items.sort((a,b)=> new Date(b.date)-new Date(a.date));
  else items.sort((a,b)=> b.pop - a.pop);

  grid.innerHTML = items.map(p => `
    <article class="card" role="listitem" aria-label="${p.title}">
      <img class="thumb" src="${p.img}" alt="${p.title}">
      <div class="card-body">
        <div class="title">${p.title}</div>
        <div class="meta">${p.cat} • ${p.type}</div>
        <div class="price-row">
          <div><strong>${SEK(p.price)}</strong></div>
          ${p.tag ? `<span class="badge">${p.tag}</span>` : ''}
        </div>
        <button class="add" data-add="${p.id}">Lägg i varukorg</button>
      </div>
    </article>
  `).join('');

  // bind
  $$('.add').forEach(btn => btn.addEventListener('click', e => {
    const id = Number(e.currentTarget.dataset.add);
    addToCart(id);
  }));
}

function openDrawer(){
  drawer.classList.add('open');
  drawer.setAttribute('aria-hidden','false');
}
function closeCartDrawer(){
  drawer.classList.remove('open');
  drawer.setAttribute('aria-hidden','true');
}

function addToCart(id){
  const found = cart.find(i => i.id === id);
  if(found) found.qty++;
  else cart.push({ id, qty:1 });
  persistCart();
  renderCart();
  cartBtn.animate([{transform:'scale(1)'},{transform:'scale(1.1)'},{transform:'scale(1)'}],{duration:350});
  openDrawer();
}

function removeFromCart(id){
  cart = cart.filter(i => i.id !== id);
  persistCart(); renderCart();
}

function changeQty(id, delta){
  const it = cart.find(i=>i.id===id);
  if(!it) return;
  it.qty += delta;
  if(it.qty <= 0) return removeFromCart(id);
  persistCart(); renderCart();
}

function renderCart(){
  const items = cart.map(ci => ({...ci, p: PRODUCTS.find(p=>p.id===ci.id)}));
  const total = items.reduce((a,c)=> a + c.p.price * c.qty, 0);

  cartList.innerHTML = items.length ? items.map(({p, qty}) => `
    <div class="cart-item">
      <img src="${p.img}" alt="${p.title}">
      <div>
        <div style="font-weight:700">${p.title}</div>
        <div class="meta">${SEK(p.price)} • ${p.cat}</div>
        <div class="qty">
          <button data-dec="${p.id}" aria-label="Minska">−</button>
          <span>${qty}</span>
          <button data-inc="${p.id}" aria-label="Öka">+</button>
        </div>
      </div>
      <button class="icon-btn" data-del="${p.id}" aria-label="Ta bort">🗑️</button>
    </div>
  `).join('') : `<p class="meta">Din varukorg är tom.</p>`;

  cartTotal.textContent = SEK(total);
  cartCount.textContent = cart.reduce((a,c)=>a+c.qty,0);

  // bind qty
  $$('.qty [data-inc]').forEach(b=> b.addEventListener('click', e => changeQty(Number(e.currentTarget.dataset.inc), +1)));
  $$('.qty [data-dec]').forEach(b=> b.addEventListener('click', e => changeQty(Number(e.currentTarget.dataset.dec), -1)));
  $$('[data-del]').forEach(b=> b.addEventListener('click', e => removeFromCart(Number(e.currentTarget.dataset.del))));
}

function persistCart(){ localStorage.setItem('streetlab-cart', JSON.stringify(cart)); }

function bindUI(){
  // category pills
  $$('.pill').forEach(p => p.addEventListener('click', e => {
    $$('.pill').forEach(x => x.classList.remove('active'));
    e.currentTarget.classList.add('active');
    state.cat = e.currentTarget.dataset.cat;
    renderProducts();
  }));
  // search
  searchInput.addEventListener('input', e => {
    state.query = e.target.value;
    renderProducts();
  });
  // sort
  sortSel.addEventListener('change', e => {
    state.sort = e.target.value;
    renderProducts();
  });
  // drawer events
  cartBtn.addEventListener('click', openDrawer);
  closeDrawer.addEventListener('click', closeCartDrawer);
  drawerCloseBtn.addEventListener('click', closeCartDrawer);
  document.addEventListener('keydown', e => { if(e.key === 'Escape') closeCartDrawer(); });

  // checkout (demo)
  $('#checkout').addEventListener('click', () => {
    alert('Demo: här skulle du gå vidare till betalning.');
  });

  // year
  $('#year').textContent = new Date().getFullYear();
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  bindUI();
  renderProducts();
  renderCart();
});
