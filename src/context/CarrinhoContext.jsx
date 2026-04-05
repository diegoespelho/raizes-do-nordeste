/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useContext, useEffect } from "react";

const CarrinhoContext = createContext();

export function CarrinhoProvider({ children }) {
  // 1. Inicializamos o estado lendo o localStorage (Lazy Initialization)
  const [itensCarrinho, setItensCarrinho] = useState(() => {
    const dadosSalvos = localStorage.getItem("raizes_nordeste_carrinho");
    // Se tiver algo salvo, converte de texto (JSON) para array. Se não, inicia vazio [].
    return dadosSalvos ? JSON.parse(dadosSalvos) : [];
  });

  // 2. Toda vez que 'itensCarrinho' for modificado, salvamos no localStorage
  useEffect(() => {
    localStorage.setItem(
      "raizes_nordeste_carrinho",
      JSON.stringify(itensCarrinho),
    );
  }, [itensCarrinho]);

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

  const removerDoCarrinho = idProduto => {
    setItensCarrinho(estadoAnterior =>
      estadoAnterior.filter(item => item.id !== idProduto),
    );
  };

  const limparCarrinho = () => {
    setItensCarrinho([]);
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

export function useCarrinho() {
  return useContext(CarrinhoContext);
}
