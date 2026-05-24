// CART.JS - Gestão do Estado do Carrinho de Compras e Regras de Fidelidade

// Estado global do carrinho e pontuação do utilizador
let cart = { items: {}, total: 0 };
let userPoints = 120;

// Persistência de Dados (Local Storage)
// Carrega o carrinho guardado anteriormente para evitar perdas ao atualizar (F5)
function loadCart() {
  const savedCart = localStorage.getItem("raizes_cart");
  if (savedCart) cart = JSON.parse(savedCart);
}

// Guarda o estado atual do carrinho fisicamente no navegador
function saveCart() {
  localStorage.setItem("raizes_cart", JSON.stringify(cart));
}

// Carrega os pontos acumulados do cliente
function loadPoints() {
  const savedPoints = localStorage.getItem("raizes_points");
  if (savedPoints !== null) userPoints = parseInt(savedPoints);
}

// Guarda os pontos atualizados do cliente
function savePoints() {
  localStorage.setItem("raizes_points", userPoints);
}

// Gestão de Itens do Carrinho
// Adiciona um novo produto ao carrinho ou incrementa a quantidade se já existir
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

// Altera a quantidade de um item de forma incremental (+1 ou -1) dentro do modal
function changeItemQuantity(productId, delta) {
  if (cart.items[productId]) {
    cart.items[productId].quantity += delta;
    cart.total += cart.items[productId].price * delta;

    // Se a quantidade for igual ou menor que zero, remove o item completamente
    if (cart.items[productId].quantity <= 0) delete cart.items[productId];

    cart.total = Math.max(0, Math.round(cart.total * 100) / 100);

    saveCart();
    updateCartUI(cart.total);
    renderCartItems();
  }
}

// Remove o item completamente, independentemente da quantidade selecionada
function removeItemFromCart(productId) {
  if (cart.items[productId]) {
    cart.total -= cart.items[productId].price * cart.items[productId].quantity;
    delete cart.items[productId];

    cart.total = Math.max(0, Math.round(cart.total * 100) / 100);

    saveCart();
    updateCartUI(cart.total);
    renderCartItems();
  }
}

// Limpa totalmente a memória do carrinho
function clearCart() {
  cart = { items: {}, total: 0 };
  saveCart();
  updateCartUI(0);
}

// Programa de Fidelidade
// Adiciona novos pontos ao saldo: Regra de 1 ponto por cada R$ 1,00 gasto
function addPoints(valorGasto) {
  const pontosGanhos = Math.floor(valorGasto);
  userPoints += pontosGanhos;
  savePoints();
  return pontosGanhos;
}

// Deduz a quantidade de pontos que foram convertidos em desconto financeiro
function deductPoints(pontosUsados) {
  userPoints -= pontosUsados;
  if (userPoints < 0) userPoints = 0;
  savePoints();
}

// Formata números para o padrão monetário brasileiro
function formatCurrency(value) {
  return `R$ ${value.toFixed(2).replace(".", ",")}`;
}

// Simulação de Pagamento
// Cria um atraso assíncrono de 2,5 segundos simulando o tempo de resposta
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
