document.addEventListener("DOMContentLoaded", () => {
  if (typeof mockMenu !== "undefined") {
    renderMenu(mockMenu);
  }
  loadCart();
  updateCartUI(cart.total);

  loadPoints();
  updatePointsUI(userPoints);

  const btnLGPD = document.getElementById("accept-lgpd");
  if (btnLGPD) btnLGPD.addEventListener("click", hideLGPDBanner);

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

  const viewMenu = document.getElementById("view-menu");
  const viewFidelity = document.getElementById("view-fidelity");
  const btnBack = document.getElementById("btn-back");
  const btnHome = document.getElementById("btn-home");
  const btnFidelity = document.getElementById("btn-fidelity");

  function switchView(viewName) {
    viewMenu.style.display = "none";
    viewFidelity.style.display = "none";

    if (viewName === "menu") {
      viewMenu.style.display = "block";
      btnBack.style.display = "none";
    } else if (viewName === "fidelity") {
      viewFidelity.style.display = "block";
      btnBack.style.display = "flex";
    }
  }

  btnFidelity.addEventListener("click", () => switchView("fidelity"));
  btnHome.addEventListener("click", () => switchView("menu"));
  btnBack.addEventListener("click", () => switchView("menu"));

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

  // Variáveis globais para controlar a matemática do desconto na sessão de compra
  let orderPointsUsed = 0;
  let orderFinalTotal = 0;

  if (cartBtn) {
    cartBtn.addEventListener("click", () => {
      if (cart.total === 0) {
        alert("Seu carrinho está vazio!");
        return;
      }
      renderCartItems();

      document.getElementById("modal-subtotal").innerText = formatCurrency(
        cart.total,
      );

      // Regra: A cada 100 pontos, R$ 5,00 de desconto
      let blocosDesconto = Math.floor(userPoints / 100);
      let valorDesconto = blocosDesconto * 5.0;

      // Limita o desconto ao valor do carrinho
      if (valorDesconto > cart.total) {
        valorDesconto = cart.total;
        // Ajusta os pontos que realmente serão deduzidos
        blocosDesconto = Math.ceil(valorDesconto / 5.0);
      }

      orderPointsUsed = blocosDesconto * 100;
      orderFinalTotal = cart.total - valorDesconto;

      document.getElementById("modal-discount-value").innerText =
        `- ${formatCurrency(valorDesconto)}`;
      document.getElementById("modal-total").innerText =
        formatCurrency(orderFinalTotal);

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
        // Deduz os pontos que foram aplicados como desconto
        if (orderPointsUsed > 0) {
          deductPoints(orderPointsUsed);
        }

        // Soma novos pontos apenas em cima do valor real que ele pagou
        const pontosAdquiridos = addPoints(orderFinalTotal);
        updatePointsUI(userPoints);

        statusText.style.color = "#28a745";

        let feedbackMsg = "Pagamento Aprovado!";
        if (orderPointsUsed > 0) {
          feedbackMsg += ` Desconto aplicado.`;
        }
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
