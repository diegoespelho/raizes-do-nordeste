window.orderPointsUsed = 0;
window.orderFinalTotal = 0;
window.currentUser = null;
window.currentUnit = null;

// Utilitário global
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
  // --- AUTENTICAÇÃO E SESSÃO ---
  function checkAuthStatus() {
    const savedUser = localStorage.getItem("raizes_user");
    const btnLogin = document.getElementById("btn-login");
    const btnFidelity = document.getElementById("btn-fidelity");

    if (savedUser) {
      window.currentUser = JSON.parse(savedUser);
      btnLogin.innerText = `Olá, ${window.currentUser.name.split(" ")[0]}`;
      btnFidelity.style.display = "flex"; // Mostra fidelidade

      // Preenche o nome no checkout automaticamente
      const clientNameInput = document.getElementById("client-name");
      if (clientNameInput) clientNameInput.value = window.currentUser.name;

      const fidelityGreeting = document.getElementById(
        "fidelity-user-greeting",
      );
      if (fidelityGreeting)
        fidelityGreeting.innerText = `Olá, ${window.currentUser.name}!`;
    } else {
      btnLogin.innerText = "Entrar";
      btnFidelity.style.display = "none";
    }
  }

  // Modal de Login
  const loginModal = document.getElementById("login-modal");
  document.getElementById("btn-login").addEventListener("click", () => {
    if (!window.currentUser) loginModal.style.display = "flex";
    // Se já estiver logado, poderia abrir um menu de perfil.
  });

  document
    .getElementById("close-login")
    .addEventListener("click", () => (loginModal.style.display = "none"));

  document.getElementById("btn-auth-submit").addEventListener("click", () => {
    const name = document.getElementById("auth-name").value;
    const phone = document.getElementById("auth-phone").value;
    if (name.length > 2) {
      const userData = { name: name, phone: phone };
      localStorage.setItem("raizes_user", JSON.stringify(userData));
      checkAuthStatus();
      loginModal.style.display = "none";
    } else {
      alert("Por favor, insira um nome válido.");
    }
  });

  // Inicialização
  checkAuthStatus();
  loadCart();
  updateCartUI(cart.total);
  loadPoints();
  updatePointsUI(userPoints);

  const btnLGPD = document.getElementById("accept-lgpd");
  if (btnLGPD) btnLGPD.addEventListener("click", hideLGPDBanner);

  const linkLGPD = document.getElementById("link-lgpd-details");
  if (linkLGPD) {
    linkLGPD.addEventListener("click", e => {
      e.preventDefault();
      switchView("lgpd");
    });
  }

  // --- FILTRAGEM POR UNIDADE (CARDÁPIO DINÂMICO) ---
  function getMenuForCurrentUnit() {
    if (!window.currentUnit) return mockMenu;
    return mockMenu.filter(
      item => item.unit === "todas" || item.unit === window.currentUnit,
    );
  }

  // Category Filter (Aplica o filtro da categoria EM CIMA do filtro da unidade)
  const categoryBtns = document.querySelectorAll(".category-btn");
  categoryBtns.forEach(btn => {
    btn.addEventListener("click", e => {
      categoryBtns.forEach(b => b.classList.remove("active"));
      e.target.classList.add("active");

      const category = e.target.getAttribute("data-category");
      let unitMenu = getMenuForCurrentUnit();

      if (category === "todos") {
        renderMenu(unitMenu);
      } else if (category === "promocoes") {
        // NOVO: Filtra apenas os itens com promo: true
        const filtered = unitMenu.filter(item => item.promo === true);
        renderMenu(filtered);
      } else {
        const filtered = unitMenu.filter(item => item.category === category);
        renderMenu(filtered);
      }
    });
  });

  // --- NAVEGAÇÃO SPA ---
  const viewHero = document.getElementById("view-hero");
  const appContainer = document.getElementById("app-container");
  const viewMenu = document.getElementById("view-menu");
  const viewFidelity = document.getElementById("view-fidelity");
  const viewLgpd = document.getElementById("view-lgpd");
  const btnBack = document.getElementById("btn-back");

  viewHero.style.display = "flex";
  appContainer.style.display = "none";

  function switchView(viewName) {
    viewHero.style.display = "none";
    viewMenu.style.display = "none";
    viewFidelity.style.display = "none";
    viewLgpd.style.display = "none";

    if (viewName === "hero") {
      viewHero.style.display = "flex";
      appContainer.style.display = "none";
    } else {
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

  // INICIAR APP E CAPTURAR UNIDADE
  document.getElementById("btn-start-app").addEventListener("click", () => {
    const unitSelector = document.getElementById("unit-select");
    if (!unitSelector.value) {
      alert(
        "Por favor, selecione a unidade desejada para ver o cardápio correto.",
      );
      return;
    }

    window.currentUnit = unitSelector.value;
    const unitName = unitSelector.options[unitSelector.selectedIndex].text;
    document.getElementById("header-unit-display").innerText = unitName;

    // Puxa o cardápio daquela unidade específica
    renderMenu(getMenuForCurrentUnit());

    // Se não estiver logado, obriga a logar para iniciar
    if (!window.currentUser) {
      loginModal.style.display = "flex";
    } else {
      switchView("menu");
    }
  });

  // Libera a tela quando o usuário faz login pela primeira vez no modal obrigatório
  document.getElementById("btn-auth-submit").addEventListener("click", () => {
    if (window.currentUnit && window.currentUser) {
      switchView("menu");
    }
  });

  document
    .getElementById("btn-fidelity")
    .addEventListener("click", () => switchView("fidelity"));
  document
    .getElementById("btn-home")
    .addEventListener("click", () => switchView("hero"));
  btnBack.addEventListener("click", () => switchView("menu"));

  // --- MODAIS DO CARRINHO E CHECKOUT ---
  const cartBtn = document.getElementById("cart-button");
  const cartModal = document.getElementById("cart-modal");
  const checkoutModal = document.getElementById("checkout-modal");
  const trackingModal = document.getElementById("tracking-modal");

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
      if (!window.currentUser) {
        alert("Faça login para gerenciar seu carrinho.");
        loginModal.style.display = "flex";
        return;
      }
      renderCartItems();
      cartModal.style.display = "flex";
    });
  }

  document
    .getElementById("btn-continue-checkout")
    .addEventListener("click", () => {
      cartModal.style.display = "none";
      checkoutModal.style.display = "flex";
    });

  const btnFinalizeOrder = document.getElementById("btn-finalize-order");
  const statusText = document.getElementById("payment-status");

  btnFinalizeOrder.addEventListener("click", async () => {
    const address = document.getElementById("client-address").value;
    if (!address) {
      alert("Por favor, preencha o endereço.");
      return;
    }

    btnFinalizeOrder.disabled = true;
    btnFinalizeOrder.innerText = "Processando...";
    statusText.innerText = "Conectando ao banco...";

    try {
      const response = await processExternalPayment();
      if (response.status === "success") {
        if (window.orderPointsUsed > 0) deductPoints(window.orderPointsUsed);
        const pontosAdquiridos = addPoints(window.orderFinalTotal);
        updatePointsUI(userPoints);

        statusText.style.color = "#28a745";
        statusText.innerText = `Pagamento Aprovado! Desconto aplicado. Ganhou +${pontosAdquiridos} pts.`;

        setTimeout(() => {
          checkoutModal.style.display = "none";
          btnFinalizeOrder.disabled = false;
          btnFinalizeOrder.innerText = "Finalizar Pedido";
          statusText.innerText = "";
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
    document.getElementById("btn-new-order").style.display = "none";

    let currentStep = 0;
    updateTrackingUI(currentStep);
    const trackingInterval = setInterval(() => {
      currentStep++;
      updateTrackingUI(currentStep);
      if (currentStep >= 4) {
        clearInterval(trackingInterval);
        document.getElementById("btn-new-order").style.display = "block";
        clearCart();
      }
    }, 3000);
  }

  document.getElementById("btn-new-order").addEventListener("click", () => {
    trackingModal.style.display = "none";
    switchView("menu");
  });
});
