// Aqui estamos exportando um array de objetos.
// Cada objeto representa um produto real que viria do Back-end.
export const dadosCardapio = [
  {
    id: 1,
    nome: "Hambúrguer Sertanejo",
    descricao:
      "Pão artesanal, blend de carne de sol, queijo coalho tostado, cebola roxa e maionese da casa.",
    preco: 28.9,
    categoria: "Lanches",
    imagem: "https://via.placeholder.com/150", // Usando placeholder temporário para não quebrar o layout
    // A sacada para o requisito "dinâmico por unidade" está aqui:
    // Uma lista das unidades que têm esse produto em estoque.
    unidadesDisponiveis: ["Centro", "Shopping", "Zona Sul"],
  },
  {
    id: 2,
    nome: "Tapioca de Frango com Catupiry",
    descricao:
      "Massa fininha e crocante, recheada com frango desfiado e catupiry original.",
    preco: 18.5,
    categoria: "Lanches",
    imagem: "https://via.placeholder.com/150",
    unidadesDisponiveis: ["Centro", "Zona Sul"], // Repare: não tem no Shopping
  },
  {
    id: 3,
    nome: "Suco de Cajá (500ml)",
    descricao: "Suco natural feito com polpa de cajá fresquinha.",
    preco: 9.0,
    categoria: "Bebidas",
    imagem: "https://via.placeholder.com/150",
    unidadesDisponiveis: ["Centro", "Shopping", "Zona Sul"],
  },
  {
    id: 4,
    nome: "Bolo de Rolo (Fatia)",
    descricao:
      "Tradicional bolo de rolo pernambucano com recheio de goiabada derretida.",
    preco: 12.0,
    categoria: "Sobremesas",
    imagem: "https://via.placeholder.com/150",
    unidadesDisponiveis: ["Shopping"], // Produto exclusivo da unidade Shopping
  },
];

// Opcional: Mock das unidades para popularmos um select/dropdown na tela inicial
export const unidadesLanchonete = [
  { id: 1, nome: "Centro", endereco: "Praça Principal, 123" },
  { id: 2, nome: "Shopping", endereco: "Praça de Alimentação, Loja 45" },
  { id: 3, nome: "Zona Sul", endereco: "Av. Beira Mar, 4500" },
];
