const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const prisma = require('../config/prisma');
const env = require('../config/env');
const AppError = require('../utils/AppError');

function signAccessToken(user) {
  return jwt.sign(
    { role: user.role, email: user.email },
    env.jwtAccessSecret,
    { subject: user.id, expiresIn: env.accessTokenTtl }
  );
}

function signRefreshToken(user) {
  return jwt.sign(
    { type: 'refresh' },
    env.jwtRefreshSecret,
    { subject: user.id, expiresIn: `${env.refreshTokenDays}d` }
  );
}

function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

function publicUser(user) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    whatsapp: user.whatsapp,
    role: user.role
  };
}

async function createSession(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const expiresAt = new Date(Date.now() + env.refreshTokenDays * 24 * 60 * 60 * 1000);

  await prisma.refreshToken.create({
    data: {
      tokenHash: hashToken(refreshToken),
      userId: user.id,
      expiresAt
    }
  });

  return { accessToken, refreshToken, user: publicUser(user) };
}

const AuthService = {
  async register(data) {
    const exists = await prisma.user.findUnique({ where: { email: data.email } });
    if (exists) {
      throw new AppError('E-mail ja cadastrado', 409, 'EMAIL_IN_USE');
    }

    const passwordHash = await bcrypt.hash(data.password, 12);
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        whatsapp: data.whatsapp,
        passwordHash,
        role: 'CUSTOMER'
      }
    });

    return createSession(user);
  },

  async login({ email, password }) {
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      throw new AppError('Credenciais invalidas', 401, 'INVALID_CREDENTIALS');
    }

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) {
      throw new AppError('Credenciais invalidas', 401, 'INVALID_CREDENTIALS');
    }

    return createSession(user);
  },

  async refresh(refreshToken) {
    if (!refreshToken) {
      throw new AppError('Refresh token ausente', 401, 'REFRESH_REQUIRED');
    }

    let payload;
    try {
      payload = jwt.verify(refreshToken, env.jwtRefreshSecret);
    } catch {
      throw new AppError('Refresh token invalido', 401, 'REFRESH_INVALID');
    }

    const tokenHash = hashToken(refreshToken);
    const stored = await prisma.refreshToken.findUnique({
      where: { tokenHash },
      include: { user: true }
    });

    if (!stored || stored.revokedAt || stored.expiresAt < new Date() || stored.userId !== payload.sub) {
      throw new AppError('Refresh token expirado ou revogado', 401, 'REFRESH_INVALID');
    }

    await prisma.refreshToken.update({
      where: { id: stored.id },
      data: { revokedAt: new Date() }
    });

    return createSession(stored.user);
  },

  async logout(refreshToken) {
    if (!refreshToken) return;
    await prisma.refreshToken.updateMany({
      where: { tokenHash: hashToken(refreshToken), revokedAt: null },
      data: { revokedAt: new Date() }
    });
  }
};

module.exports = AuthService;
