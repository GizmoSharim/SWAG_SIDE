require('dotenv').config();

const parseList = (value, fallback) => {
  const items = value
    ? value.split(',').map((item) => item.trim()).filter(Boolean)
    : fallback;

  return items.map((item) => item.replace(/\/$/, ''));
};

module.exports = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number(process.env.PORT || 3333),
  corsOrigins: parseList(process.env.CORS_ORIGINS, [
    'http://localhost:3000',
    'http://127.0.0.1:3000'
  ]),
  jwtAccessSecret: process.env.JWT_ACCESS_SECRET || 'dev-access-secret-change-me',
  jwtRefreshSecret: process.env.JWT_REFRESH_SECRET || 'dev-refresh-secret-change-me',
  accessTokenTtl: process.env.ACCESS_TOKEN_TTL || '15m',
  refreshTokenDays: Number(process.env.REFRESH_TOKEN_DAYS || 7),
  cookieSecure: process.env.COOKIE_SECURE === 'true',
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_KEY
  },
  cloudinary: {
    cloudName: process.env.CLOUDINARY_CLOUD_NAME,
    apiKey: process.env.CLOUDINARY_API_KEY,
    apiSecret: process.env.CLOUDINARY_API_SECRET
  }
};
