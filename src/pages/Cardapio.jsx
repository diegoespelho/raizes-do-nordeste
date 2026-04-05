import React, { useState } from "react";
import CardProduto from "../components/CardProduto";
import { dadosCardapio, unidadesLanchonete } from "../mocks/cardapio";
import "./Cardapio.css";

export default function Cardapio() {
  // Estado para guardar a unidade que o cliente escolheu no select.
  // Vamos começar com "Centro" como padrão.
  const [unidadeSelecionada, setUnidadeSelecionada] = useState("Centro");

  // Aqui atendemos ao requisito do roteiro: o cardápio dinâmico!
  // Filtramos a lista para renderizar só o que a unidade selecionada tem em estoque.
  const produtosFiltrados = dadosCardapio.filter(produto =>
    produto.unidadesDisponiveis.includes(unidadeSelecionada),
  );

  return (
    <main className="pagina-cardapio">
      <header>
        <h1>Cardápio - Raízes do Nordeste</h1>

        {/* Seletor de Unidade */}
        <div className="filtro-unidade">
          <label htmlFor="unidade">Você está pedindo na unidade: </label>
          <select
            id="unidade"
            value={unidadeSelecionada}
            onChange={evento => setUnidadeSelecionada(evento.target.value)}>
            {unidadesLanchonete.map(unidade => (
              <option key={unidade.id} value={unidade.nome}>
                {unidade.nome}
              </option>
            ))}
          </select>
        </div>
      </header>

      {/* Renderização da Lista de Produtos */}
      <section className="lista-produtos">
        {produtosFiltrados.length > 0 ? (
          produtosFiltrados.map(produto => (
            <CardProduto key={produto.id} produto={produto} />
          ))
        ) : (
          <p>Poxa, não temos produtos disponíveis nessa unidade no momento.</p>
        )}
      </section>
    </main>
  );
}
