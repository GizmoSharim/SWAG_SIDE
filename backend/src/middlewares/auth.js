const jwt = require('jsonwebtoken');
const env = require('../config/env');
const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

async function authenticate(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const bearerToken = header.startsWith('Bearer ') ? header.slice(7) : null;
    const token = req.cookies?.accessToken || bearerToken;

    if (!token) {
      throw new AppError('Autenticacao obrigatoria', 401, 'AUTH_REQUIRED');
    }

    const payload = jwt.verify(token, env.jwtAccessSecret);
    const user = await prisma.user.findUnique({
      where: { id: payload.sub },
      select: { id: true, name: true, email: true, role: true }
    });

    if (!user) {
      throw new AppError('Usuario nao encontrado', 401, 'AUTH_INVALID');
    }

    req.user = user;
    return next();
  } catch (error) {
    if (error instanceof AppError) return next(error);
    return next(new AppError('Sessao invalida ou expirada', 401, 'AUTH_INVALID'));
  }
}

const authorize = (...roles) => (req, res, next) => {
  if (!req.user || !roles.includes(req.user.role)) {
    return next(new AppError('Permissao insuficiente', 403, 'FORBIDDEN'));
  }

  return next();
};

module.exports = { authenticate, authorize };
