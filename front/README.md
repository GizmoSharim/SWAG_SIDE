# Swag Side — Frontend React

## Estrutura do projeto

```
src/
├── services/
│   └── api.js              # Todas as chamadas ao backend (fetch)
├── context/
│   └── CartContext.jsx     # Estado global do carrinho (useReducer)
├── hooks/
│   └── useProducts.js      # Busca produtos da API
├── components/
│   ├── Header.jsx          # Navbar com logo e botão do carrinho
│   ├── Header.module.css
│   ├── ProductCard.jsx     # Card de produto com seleção de tamanho
│   ├── ProductCard.module.css
│   ├── CartPanel.jsx       # Carrinho lateral + fluxo WhatsApp
│   └── CartPanel.module.css
├── pages/
│   ├── ProductsPage.jsx    # Grid de produtos + filtros por categoria
│   └── ProductsPage.module.css
├── App.jsx
├── main.jsx
└── index.css
```

## Instalação

```bash
npm install
```

## Configuração

Copie o arquivo de variáveis de ambiente:

```bash
cp .env.example .env
```

Edite o `.env`:

```env
VITE_API_URL=http://localhost:3333
VITE_WHATSAPP_NUMBER=5592999999999   # número da loja com DDI, sem + ou espaços
```

## Rodando em desenvolvimento

Certifique-se que o backend Node está rodando na porta 3333, depois:

```bash
npm run dev
```

O Vite faz proxy automático de `/products` e `/orders` para `localhost:3333`,
eliminando erros de CORS em desenvolvimento.

## Build para produção

```bash
npm run build
```

## Integração com o backend

### O que o frontend espera receber em `GET /products`

```json
[
  {
    "id": 1,
    "name": "Camiseta Acid Wash",
    "category": "Camisetas",
    "price": 89.90,
    "oldPrice": null,
    "imageUrl": "https://...",
    "isNew": true,
    "sizes": ["P", "M", "G", "GG"]
  }
]
```

> `oldPrice`, `imageUrl`, `isNew` e `sizes` são opcionais — o componente lida com ausência.

### O que o frontend envia em `POST /orders`

```json
{
  "items": [
    {
      "productId": 1,
      "name": "Camiseta Acid Wash",
      "size": "M",
      "qty": 2,
      "price": 89.90
    }
  ],
  "total": 179.80
}
```

O backend deve retornar `{ "id": "<id_do_pedido>" }` para que o número do pedido
apareça na mensagem do WhatsApp.

## Fluxo de compra

1. Usuário navega pelos produtos e seleciona tamanho
2. Clica em "Adicionar" → item vai para o carrinho (Context API)
3. Abre o painel lateral do carrinho
4. Clica em "Finalizar pelo WhatsApp"
5. Frontend faz `POST /orders` salvando o pedido no banco
6. Abre `wa.me/<numero>?text=...` com a mensagem completa do pedido
7. Carrinho é limpo automaticamente
