import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext"; // 1. Importamos o hook
import "./Carrinho.css";

export default function Checkout() {
  const [aceitouLGPD, setAceitouLGPD] = useState(false);
  const navigate = useNavigate();

  // 2. Extraímos a função de limpar o carrinho da nossa nuvem
  const { limparCarrinho } = useCarrinho();

  const simularPagamento = e => {
    e.preventDefault(); // Evita que a página recarregue ao enviar o formulário

    if (!aceitouLGPD) {
      alert(
        "Para continuar, você precisa aceitar os termos de privacidade (LGPD).",
      );
      return;
    }

    // Simulação visual de redirecionamento exigida no roteiro [cite: 91]
    alert("Redirecionando para o ambiente seguro de pagamento...");

    // Usamos o setTimeout para simular o tempo que o banco leva para aprovar a compra
    setTimeout(() => {
      alert("✅ Pagamento aprovado! Seu pedido foi enviado para a cozinha.");
      limparCarrinho(); // 3. Esvazia o carrinho no estado global
      navigate("/"); // 4. Redireciona o cliente de volta para o cardápio
    }, 1500); // Aguarda 1,5 segundos antes de executar
  };

  return (
    <main className="pagina-carrinho">
      <h1>Finalizar Pedido</h1>

      <div className="conteudo-carrinho">
        <section className="lista-itens" style={{ flex: 1.5 }}>
          <form onSubmit={simularPagamento} className="formulario-checkout">
            <h2>Dados para Entrega</h2>

            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Nome Completo"
                required
                style={inputStyle}
              />
            </div>
            <div style={{ marginBottom: "15px" }}>
              <input
                type="text"
                placeholder="Endereço de Entrega"
                required
                style={inputStyle}
              />
            </div>

            {/* Quadro de LGPD - Obrigatório para os 15 pontos do roteiro [cite: 189, 191] */}
            <div
              style={{
                backgroundColor: "#fff3cd",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
                border: "1px solid #ffeeba",
              }}>
              <h3 style={{ fontSize: "1rem", marginBottom: "10px" }}>
                Termos de Privacidade (LGPD)
              </h3>
              <label
                style={{
                  display: "flex",
                  gap: "10px",
                  alignItems: "flex-start",
                  fontSize: "0.9rem",
                }}>
                <input
                  type="checkbox"
                  checked={aceitouLGPD}
                  onChange={e => setAceitouLGPD(e.target.checked)}
                  style={{ marginTop: "4px" }}
                />
                Declaro que li e concordo com a Política de Privacidade.
                Consinto com a coleta e tratamento dos meus dados pessoais (nome
                e endereço) exclusivamente para a entrega e faturamento deste
                pedido, conforme a Lei Geral de Proteção de Dados.
              </label>
            </div>

            <button
              type="submit"
              className="botao-finalizar"
              style={{ width: "100%", border: "none", cursor: "pointer" }}>
              Pagar com Cartão (Ambiente Seguro)
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}

const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};
