import React from "react";
import { Link } from "react-router-dom";
import { useCarrinho } from "../context/CarrinhoContext"; // Importamos o hook
import "./Header.css";

export default function Header() {
  // Pegamos a lista de itens da "nuvem"
  const { itensCarrinho } = useCarrinho();

  // Somamos a quantidade total de itens (ex: 2 hambúrgueres + 1 suco = 3)
  const quantidadeTotal = itensCarrinho.reduce(
    (acumulador, item) => acumulador + item.quantidade,
    0,
  );

  return (
    <header className="cabecalho-principal">
      <div className="conteiner-cabecalho">
        <Link to="/" className="logo">
          🍔 Raízes do Nordeste
        </Link>

        <nav className="menu-acoes">
          <button
            className="botao-fidelidade"
            onClick={() => alert("Fluxo de Fidelidade em breve!")}>
            👤 Entrar / Fidelidade
          </button>

          <Link to="/carrinho" className="botao-carrinho">
            🛒 Carrinho
            {/* Agora a bolinha só aparece se a quantidade real for maior que zero */}
            {quantidadeTotal > 0 && (
              <span className="contador-badge">{quantidadeTotal}</span>
            )}
          </Link>
        </nav>
      </div>
    </header>
  );
}
