import React from "react";
import { useCarrinho } from "../context/CarrinhoContext";
import toast from "react-hot-toast"; // 1. Importamos a função toast
import "./CardProduto.css";

export default function CardProduto({ produto }) {
  const { adicionarAoCarrinho } = useCarrinho();

  const formatarPreco = valor => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const lidarComAdicao = () => {
    adicionarAoCarrinho(produto);
    // 2. Substituímos o alert por uma notificação de sucesso bonitinha!
    toast.success(`${produto.nome} foi adicionado!`, {
      style: {
        borderRadius: "10px",
        background: "#1D3557", // Usando o azul escuro do nosso layout
        color: "#fff",
      },
    });
  };

  return (
    <div className="card-produto">
      <div className="imagem-container">
        <img src={produto.imagem} alt={`Foto de ${produto.nome}`} />
      </div>

      <div className="info-produto">
        <h3>{produto.nome}</h3>
        <p>{produto.descricao}</p>
        <span className="preco">{formatarPreco(produto.preco)}</span>

        <button onClick={lidarComAdicao}>Adicionar</button>
      </div>
    </div>
  );
}
