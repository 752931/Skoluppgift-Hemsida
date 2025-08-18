let cart = [];
let total = 0;

function addToCart(item, price) {
  cart.push({ item, price });
  total += price;
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total");
  cartList.innerHTML = "";

  cart.forEach(c => {
    let li = document.createElement("li");
    li.textContent = `${c.item} - ${c.price} kr`;
    cartList.appendChild(li);
  });

  totalDisplay.textContent = `Totalt: ${total} kr`;
}
