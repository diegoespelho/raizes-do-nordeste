let cart = {
  items: {},
  total: 0,
};

let userPoints = 120;

function loadCart() {
  const savedCart = localStorage.getItem("raizes_cart");
  if (savedCart) {
    cart = JSON.parse(savedCart);
  }
}

function saveCart() {
  localStorage.setItem("raizes_cart", JSON.stringify(cart));
}

function addItemToCart(productId, name, price) {
  if (cart.items[productId]) {
    cart.items[productId].quantity += 1;
  } else {
    cart.items[productId] = {
      id: productId,
      name: name,
      price: price,
      quantity: 1,
    };
  }
  cart.total += price;
  saveCart();
  updateCartUI(cart.total);
}

function clearCart() {
  cart = { items: {}, total: 0 };
  saveCart();
  updateCartUI(0);
}

function loadPoints() {
  const savedPoints = localStorage.getItem("raizes_points");
  if (savedPoints !== null) {
    userPoints = parseInt(savedPoints);
  }
}

function savePoints() {
  localStorage.setItem("raizes_points", userPoints);
}

function addPoints(valorGasto) {
  const pontosGanhos = Math.floor(valorGasto);
  userPoints += pontosGanhos;
  savePoints();
  return pontosGanhos;
}

function deductPoints(pontosUsados) {
  userPoints -= pontosUsados;
  if (userPoints < 0) userPoints = 0;
  savePoints();
}

function formatCurrency(value) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

function processExternalPayment() {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve({
        status: "success",
        transactionId: "PIX-" + Math.floor(Math.random() * 1000000),
      });
    }, 2500);
  });
}
