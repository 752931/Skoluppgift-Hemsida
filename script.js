let cartCount = 0;

function addToCart(product) {
  cartCount++;
  document.getElementById("cart-count").textContent = cartCount;
  alert(product + " har lagts i varukorgen!");
}
