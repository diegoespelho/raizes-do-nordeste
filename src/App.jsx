import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Importamos o Provider que acabamos de criar
import { CarrinhoProvider } from "./context/CarrinhoContext";

import Header from "./components/Header";
import Cardapio from "./pages/Cardapio";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    // Envolvemos toda a aplicação com o CarrinhoProvider
    <CarrinhoProvider>
      <BrowserRouter>
        <Header />
        <Routes>
          <Route path="/" element={<Cardapio />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/checkout" element={<Checkout />} />
        </Routes>
      </BrowserRouter>
    </CarrinhoProvider>
  );
}
