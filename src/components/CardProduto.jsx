import React from "react";
// Importamos o nosso hook personalizado
import { useCarrinho } from "../context/CarrinhoContext";
import "./CardProduto.css";

export default function CardProduto({ produto }) {
  // Puxamos a função da nossa "nuvem"
  const { adicionarAoCarrinho } = useCarrinho();

  const formatarPreco = valor => {
    return valor.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  // Função que será chamada ao clicar no botão
  const lidarComAdicao = () => {
    adicionarAoCarrinho(produto);
    alert(`${produto.nome} foi adicionado ao carrinho!`); // Feedback simples pro usuário
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

        {/* Agora o botão chama a função real! */}
        <button onClick={lidarComAdicao}>Adicionar</button>
      </div>
    </div>
  );
}
