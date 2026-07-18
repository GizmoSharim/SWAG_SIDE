const AuthService = require('../services/AuthService');
const asyncHandler = require('../utils/asyncHandler');
const env = require('../config/env');

const cookieOptions = {
  httpOnly: true,
  sameSite: 'lax',
  secure: env.cookieSecure,
  path: '/'
};

function setAuthCookies(res, session) {
  res.cookie('accessToken', session.accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000
  });
  res.cookie('refreshToken', session.refreshToken, {
    ...cookieOptions,
    maxAge: env.refreshTokenDays * 24 * 60 * 60 * 1000
  });
}

const AuthController = {
  register: asyncHandler(async (req, res) => {
    const session = await AuthService.register(req.body);
    setAuthCookies(res, session);
    return res.status(201).json({ user: session.user, accessToken: session.accessToken });
  }),

  login: asyncHandler(async (req, res) => {
    const session = await AuthService.login(req.body);
    setAuthCookies(res, session);
    return res.json({ user: session.user, accessToken: session.accessToken });
  }),

  refresh: asyncHandler(async (req, res) => {
    const session = await AuthService.refresh(req.cookies?.refreshToken);
    setAuthCookies(res, session);
    return res.json({ user: session.user, accessToken: session.accessToken });
  }),

  logout: asyncHandler(async (req, res) => {
    await AuthService.logout(req.cookies?.refreshToken);
    res.clearCookie('accessToken', cookieOptions);
    res.clearCookie('refreshToken', cookieOptions);
    return res.status(204).send();
  }),

  me: asyncHandler(async (req, res) => {
    return res.json({ user: req.user });
  })
};

module.exports = AuthController;
