import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext";
import toast from "react-hot-toast";
import "./Carrinho.css";

export default function Checkout() {
  const [aceitouLGPD, setAceitouLGPD] = useState(false);
  const navigate = useNavigate();
  const { limparCarrinho } = useCarrinho();

  const simularPagamento = e => {
    e.preventDefault();

    // Validação da LGPD com Toast de Erro
    if (!aceitouLGPD) {
      toast.error("Você precisa aceitar os termos de privacidade (LGPD).");
      return;
    }

    // Toast de "Loading" que segura a tela e avisa o usuário
    const toastId = toast.loading(
      "Processando pagamento em ambiente seguro...",
    );

    // Simula o tempo de resposta do servidor do banco (2 segundos)
    setTimeout(() => {
      // Atualiza o MESMO Toast para mostrar o sucesso
      toast.success("Pagamento aprovado! Pedido enviado para a cozinha.", {
        id: toastId,
        duration: 3000,
      });

      limparCarrinho(); // Limpa o estado global e o localStorage
      navigate("/"); // Volta para o início
    }, 2000);
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

            {/* Requisito Obrigatório: LGPD Explícita */}
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

// Estilo inline mantido apenas para os inputs ficarem alinhados
const inputStyle = {
  width: "100%",
  padding: "12px",
  borderRadius: "8px",
  border: "1px solid #ccc",
  fontSize: "1rem",
};
