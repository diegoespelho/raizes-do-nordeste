function renderMenu(menuData) {
  const productList = document.getElementById("product-list");
  productList.innerHTML = "";

  if (menuData.length === 0) {
    productList.innerHTML =
      '<p style="text-align:center; color:var(--text-muted); grid-column: 1/-1;">Nenhum produto nesta categoria.</p>';
    return;
  }

  menuData.forEach(product => {
    const card = document.createElement("div");
    card.className = "product-card";
    card.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-img" onerror="this.onerror=null; this.src='https://via.placeholder.com/80?text=Sem+Foto';">
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <span class="price">${formatCurrency(product.price)}</span>
            </div>
            <div class="product-actions">
                <button class="add-btn" onclick="addItemToCart(${product.id}, '${product.name}', ${product.price})">+</button>
            </div>
        `;
    productList.appendChild(card);
  });
}

function updateCartUI(newTotal) {
  document.getElementById("cart-total").innerText = formatCurrency(newTotal);
  const cartBtn = document.getElementById("cart-button");
  cartBtn.style.transform = "translateX(-50%) scale(1.05)";
  setTimeout(() => {
    cartBtn.style.transform = "translateX(-50%) scale(1)";
  }, 150);
}

function renderCartItems() {
  const container = document.getElementById("cart-items-container");
  container.innerHTML = "";
  const itemsArray = Object.values(cart.items);

  if (itemsArray.length === 0) {
    container.innerHTML =
      '<p style="text-align:center; color:var(--text-muted); padding: 20px 0;">Seu carrinho está vazio.</p>';
    if (window.updateModalTotals) window.updateModalTotals();
    return;
  }

  itemsArray.forEach(item => {
    const row = document.createElement("div");
    row.className = "cart-item-row";
    row.innerHTML = `
            <div class="cart-item-name">${item.name}</div>
            <div class="cart-item-actions">
                <span class="cart-item-price">${formatCurrency(item.price * item.quantity)}</span>
                <div class="cart-item-controls">
                    <button class="qty-btn" onclick="changeItemQuantity(${item.id}, -1)">-</button>
                    <span class="qty-display">${item.quantity}</span>
                    <button class="qty-btn" onclick="changeItemQuantity(${item.id}, 1)">+</button>
                    <button class="remove-btn" onclick="removeItemFromCart(${item.id})" title="Remover item">🗑️</button>
                </div>
            </div>
        `;
    container.appendChild(row);
  });

  if (window.updateModalTotals) window.updateModalTotals();
}

function hideLGPDBanner() {
  const banner = document.getElementById("lgpd-banner");
  if (banner) banner.style.display = "none";
}

function updatePointsUI(points) {
  const headerPoints = document.querySelector(".app-header .points");
  if (headerPoints) headerPoints.innerText = `${points} pts`;

  const fidelityHighlight = document.querySelector(".points-highlight");
  if (fidelityHighlight) fidelityHighlight.innerText = `${points} Pontos`;
}

function updateTrackingUI(stepIndex) {
  const totalSteps = 5;
  for (let i = 0; i < totalSteps; i++) {
    const stepEl = document.getElementById(`step-${i}`);
    if (i < stepIndex) {
      stepEl.className = "timeline-step completed";
    } else if (i === stepIndex) {
      stepEl.className = "timeline-step active";
    } else {
      stepEl.className = "timeline-step";
    }
  }
}
