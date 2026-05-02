window.orderPointsUsed = 0;
window.orderFinalTotal = 0;

window.updateModalTotals = function () {
  const subtotalEl = document.getElementById("modal-subtotal");
  const discountEl = document.getElementById("modal-discount-value");
  const totalEl = document.getElementById("modal-total");
  const btnContinue = document.getElementById("btn-continue-checkout");

  if (!subtotalEl) return;

  subtotalEl.innerText = formatCurrency(cart.total);

  let blocosDesconto = Math.floor(userPoints / 100);
  let valorDesconto = blocosDesconto * 5.0;

  if (valorDesconto > cart.total) {
    valorDesconto = cart.total;
    blocosDesconto = Math.ceil(valorDesconto / 5.0);
  }

  window.orderPointsUsed = blocosDesconto * 100;
  window.orderFinalTotal = cart.total - valorDesconto;

  discountEl.innerText = `- ${formatCurrency(valorDesconto)}`;
  totalEl.innerText = formatCurrency(window.orderFinalTotal);

  if (cart.total === 0) {
    btnContinue.disabled = true;
    btnContinue.style.opacity = "0.5";
  } else {
    btnContinue.disabled = false;
    btnContinue.style.opacity = "1";
  }
};

document.addEventListener("DOMContentLoaded", () => {
  if (typeof mockMenu !== "undefined") renderMenu(mockMenu);
  loadCart();
  updateCartUI(cart.total);
  loadPoints();
  updatePointsUI(userPoints);

  // LGPD Global Interactions
  const btnLGPD = document.getElementById("accept-lgpd");
  if (btnLGPD) btnLGPD.addEventListener("click", hideLGPDBanner);

  const linkLGPD = document.getElementById("link-lgpd-details");
  if (linkLGPD) {
    linkLGPD.addEventListener("click", e => {
      e.preventDefault();
      switchView("lgpd");
    });
  }

  // Category Filter
  const categoryBtns = document.querySelectorAll(".category-btn");
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      categoryBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const category = e.target.getAttribute("data-category");
      if (category === "todos") {
        renderMenu(mockMenu);
      } else {
        const filtered = mockMenu.filter(item => item.category === category);
        renderMenu(filtered);
      }
    });
  });

  // --- SISTEMA DE NAVEGAÇÃO SPA (ATUALIZADO) ---
  const viewHero = document.getElementById("view-hero");
  const appContainer = document.getElementById("app-container");
  const viewMenu = document.getElementById("view-menu");
  const viewFidelity = document.getElementById("view-fidelity");
  const viewLgpd = document.getElementById("view-lgpd");

  const btnBack = document.getElementById("btn-back");
  const btnHome = document.getElementById("btn-home");
  const btnFidelity = document.getElementById("btn-fidelity");
  const btnStartApp = document.getElementById("btn-start-app");

  // Estado inicial: Mostra Hero e esconde App
  viewHero.style.display = "flex";
  appContainer.style.display = "none";

  function switchView(viewName) {
    // Esconde tudo primeiro
    viewHero.style.display = "none";
    viewMenu.style.display = "none";
    viewFidelity.style.display = "none";
    viewLgpd.style.display = "none";

    if (viewName === "hero") {
      viewHero.style.display = "flex";
      appContainer.style.display = "none";
    } else {
      // Se não for hero, garante que o app-container está visível
      appContainer.style.display = "block";

      if (viewName === "menu") {
        viewMenu.style.display = "block";
        btnBack.style.display = "none";
      } else if (viewName === "fidelity") {
        viewFidelity.style.display = "block";
        btnBack.style.display = "flex";
      } else if (viewName === "lgpd") {
        viewLgpd.style.display = "block";
        btnBack.style.display = "flex";
      }
    }
  }

  // Eventos de Navegação
  btnStartApp.addEventListener("click", () => switchView("menu"));
  btnFidelity.addEventListener("click", () => switchView("fidelity"));
  btnHome.addEventListener("click", () => switchView("menu")); // Clique no logo vai pro cardápio
  btnBack.addEventListener("click", () => switchView("menu")); // Voltar vai pro cardápio

  // --- CONTROLE DE MODAIS ---
  const cartBtn = document.getElementById("cart-button");
  const cartModal = document.getElementById("cart-modal");
  const checkoutModal = document.getElementById("checkout-modal");
  const trackingModal = document.getElementById("tracking-modal");

  const btnContinueCheckout = document.getElementById("btn-continue-checkout");
  const btnFinalizeOrder = document.getElementById("btn-finalize-order");
  const btnNewOrder = document.getElementById("btn-new-order");
  const statusText = document.getElementById("payment-status");

  document
    .getElementById("close-cart")
    .addEventListener("click", () => (cartModal.style.display = "none"));
  document
    .getElementById("close-checkout")
    .addEventListener("click", () => (checkoutModal.style.display = "none"));
  document
    .getElementById("close-tracking")
    .addEventListener("click", () => (trackingModal.style.display = "none"));

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      renderCartItems();
      cartModal.style.display = "flex";
    });
  }

  btnContinueCheckout.addEventListener("click", () => {
    cartModal.style.display = "none";
    checkoutModal.style.display = "flex";
  });

  btnFinalizeOrder.addEventListener("click", async () => {
    const name = document.getElementById("client-name").value;
    const address = document.getElementById("client-address").value;

    if (!name || !address) {
      alert("Por favor, preencha nome e endereço.");
      return;
    }

    btnFinalizeOrder.disabled = true;
    btnFinalizeOrder.innerText = "Processando Pagamento...";
    statusText.innerText = "Conectando ao sistema...";

    try {
      const response = await processExternalPayment();

      if (response.status === "success") {
        if (window.orderPointsUsed > 0) deductPoints(window.orderPointsUsed);
        const pontosAdquiridos = addPoints(window.orderFinalTotal);
        updatePointsUI(userPoints);

        statusText.style.color = "#28a745";
        let feedbackMsg = "Pagamento Aprovado!";
        if (window.orderPointsUsed > 0) feedbackMsg += ` Desconto aplicado.`;
        feedbackMsg += ` Ganhou +${pontosAdquiridos} pts.`;
        statusText.innerText = feedbackMsg;

        setTimeout(() => {
          checkoutModal.style.display = "none";
          btnFinalizeOrder.disabled = false;
          btnFinalizeOrder.innerText = "Finalizar Pedido";
          statusText.innerText = "";
          document.getElementById("client-name").value = "";
          document.getElementById("client-address").value = "";

          startOrderTracking(response.transactionId);
        }, 2500);
      }
    } catch (error) {
      statusText.style.color = "#ea1d2c";
      statusText.innerText = "Erro no pagamento.";
      btnFinalizeOrder.disabled = false;
    }
  });

  function startOrderTracking(orderId) {
    trackingModal.style.display = "flex";
    document.getElementById("order-id-display").innerText = orderId.replace(
      "PIX-",
      "",
    );
    btnNewOrder.style.display = "none";

    let currentStep = 0;
    updateTrackingUI(currentStep);

    const trackingInterval = setInterval(() => {
      currentStep++;
      updateTrackingUI(currentStep);

      if (currentStep >= 4) {
        clearInterval(trackingInterval);
        btnNewOrder.style.display = "block";
        clearCart();
      }
    }, 3000);
  }

  btnNewOrder.addEventListener("click", () => {
    trackingModal.style.display = "none";
    switchView("menu");
  });
});
