/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext } from "react";

// 1. Criamos o contexto
const CarrinhoContext = createContext();

// 2. Criamos o Provedor
export function CarrinhoProvider({ children }) {
  const [itensCarrinho, setItensCarrinho] = useState([]);

  const adicionarAoCarrinho = produto => {
    setItensCarrinho(estadoAnterior => {
      const itemExistente = estadoAnterior.find(item => item.id === produto.id);

      if (itemExistente) {
        return estadoAnterior.map(item =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item,
        );
      } else {
        return [...estadoAnterior, { ...produto, quantidade: 1 }];
      }
    });
  };

  const limparCarrinho = () => {
    setItensCarrinho([]);
  };

  // --- NOVA FUNÇÃO AQUI ---
  // Ela filtra a lista, mantendo todos os itens, EXCETO aquele com o ID que queremos remover
  const removerDoCarrinho = idProduto => {
    setItensCarrinho(estadoAnterior =>
      estadoAnterior.filter(item => item.id !== idProduto),
    );
  };

  return (
    <CarrinhoContext.Provider
      value={{
        itensCarrinho,
        adicionarAoCarrinho,
        limparCarrinho,
        removerDoCarrinho,
      }}>
      {children}
    </CarrinhoContext.Provider>
  );
}

// 3. Criamos o Hook personalizado
export function useCarrinho() {
  return useContext(CarrinhoContext);
}
