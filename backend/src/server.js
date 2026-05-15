require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes/routes');

const app = express();

// --- MIDDLEWARES (Configurações) ---

const allowedOrigins = [
  'http://localhost:5173',
  'http://127.0.0.1:5173',
  'http://localhost:3000',
  'http://127.0.0.1:3000',
  'http://localhost:3001',
  'http://127.0.0.1:3001',
];

// Libera o acesso para o Frontend (React)
app.use(cors({
  origin(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    return callback(new Error(`Origem nao permitida pelo CORS: ${origin}`));
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

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
