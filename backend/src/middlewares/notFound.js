function notFound(req, res) {
  return res.status(404).json({ error: 'Rota nao encontrada' });
}

module.exports = notFound;
