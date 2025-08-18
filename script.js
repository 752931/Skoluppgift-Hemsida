let cart = [];
let total = 0;

function addToCart(product, price) {
  cart.push({ product, price });
  total += price;
  document.getElementById("cart-count").innerText = cart.length;
  renderCart();
}

function renderCart() {
  const itemsContainer = document.getElementById("cart-items");
  itemsContainer.innerHTML = "";
  cart.forEach(item => {
    let li = document.createElement("li");
    li.textContent = `${item.product} - ${item.price} SEK`;
    itemsContainer.appendChild(li);
  });
  document.getElementById("cart-total").innerText = total;
}

function toggleCart() {
  document.getElementById("cart").classList.toggle("hidden");
}

function checkout() {
  alert("Tack för ditt köp!");
  cart = [];
  total = 0;
  document.getElementById("cart-count").innerText = 0;
  renderCart();
}
