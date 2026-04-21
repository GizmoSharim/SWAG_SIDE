const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();

// --- MIDDLEWARES (Configurações) ---

// Libera o acesso para o Frontend (React) do Geovanni
app.use(cors()); 

// Permite que o servidor entenda dados enviados em formato JSON
app.use(express.json());

// --- ROTAS ---

// Carrega as rotas de produtos e pedidos
app.use(routes);

// --- TRATAMENTO DE ERROS (Robustez) ---

// Se qualquer rota der erro, esse bloco impede o servidor de cair
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Algo deu errado no servidor!',
    message: err.message
  });
});

// --- INICIALIZAÇÃO ---

const PORT = 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em http://localhost:${PORT}`);
});