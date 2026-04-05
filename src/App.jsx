import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom"; // <-- Essa é a linha que estava faltando!
import { Toaster } from "react-hot-toast";
import { CarrinhoProvider } from "./context/CarrinhoContext";

import Header from "./components/Header";
import Cardapio from "./pages/Cardapio";
import Carrinho from "./pages/Carrinho";
import Checkout from "./pages/Checkout";

export default function App() {
  return (
    <CarrinhoProvider>
      <BrowserRouter>
        {/* O Toaster fica aqui no topo para capturar os avisos de qualquer página */}
        <Toaster position="top-center" reverseOrder={false} />

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
