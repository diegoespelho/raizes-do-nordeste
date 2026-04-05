import React from "react";
import { Link } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext"; // 1. Importando o Hook
import "./Carrinho.css";

export default function Carrinho() {
  // 2. Puxando os dados reais e a função de remover lá da nossa nuvem
  const { itensCarrinho, removerDoCarrinho } = useCarrinho();

  // A matemática continua igual, mas agora calcula em cima dos itens reais!
  const subtotal = itensCarrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0,
  );
  const taxaEntrega = 5.0;
  const total = subtotal + taxaEntrega;

  const formatarPreco = valor =>
    valor.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  // 3. Validação de UX: E se o carrinho estiver vazio?
  if (itensCarrinho.length === 0) {
    return (
      <main
        className="pagina-carrinho"
        style={{ textAlign: "center", padding: "100px 20px" }}>
        <h2
          style={{ color: "var(--cor-texto-principal)", marginBottom: "15px" }}>
          Seu carrinho está vazio 😕
        </h2>
        <p
          style={{
            color: "var(--cor-texto-secundario)",
            marginBottom: "30px",
          }}>
          Bateu a fome? Dê uma olhada nas nossas delícias nordestinas.
        </p>
        <Link
          to="/"
          className="botao-finalizar"
          style={{ display: "inline-block", padding: "15px 40px" }}>
          Ver Cardápio
        </Link>
      </main>
    );
  }

  // 4. Renderização do carrinho com itens
  return (
    <main className="pagina-carrinho">
      <h1>Seu Pedido</h1>

      <div className="conteudo-carrinho">
        <section className="lista-itens">
          {itensCarrinho.map(item => (
            <div key={item.id} className="item-carrinho">
              <div className="info-item">
                <h3>{item.nome}</h3>
                <p>Quantidade: {item.quantidade}</p>
                {/* Botão para remover o item */}
                <button
                  onClick={() => removerDoCarrinho(item.id)}
                  style={{
                    background: "none",
                    border: "none",
                    color: "var(--cor-primaria)",
                    cursor: "pointer",
                    marginTop: "10px",
                    fontWeight: "bold",
                    fontSize: "0.9rem",
                  }}>
                  Remover item
                </button>
              </div>
              <span className="preco-item">
                {formatarPreco(item.preco * item.quantidade)}
              </span>
            </div>
          ))}
        </section>

        <aside className="resumo-pedido">
          <h2>Resumo</h2>
          <div className="linha-resumo">
            <span>Subtotal</span>
            <span>{formatarPreco(subtotal)}</span>
          </div>
          <div className="linha-resumo">
            <span>Taxa de Entrega</span>
            <span>{formatarPreco(taxaEntrega)}</span>
          </div>
          <div className="linha-resumo total">
            <span>Total</span>
            <span>{formatarPreco(total)}</span>
          </div>

          <Link to="/checkout" className="botao-finalizar">
            Ir para Pagamento
          </Link>
          <Link to="/" className="botao-continuar">
            Continuar Comprando
          </Link>
        </aside>
      </div>
    </main>
  );
}
