const { ZodError } = require('zod');
const AppError = require('../utils/AppError');
const env = require('../config/env');

function errorHandler(error, req, res, next) {
  if (error instanceof ZodError) {
    return res.status(400).json({
      error: 'Dados invalidos',
      issues: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message
      }))
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      error: error.message,
      code: error.code
    });
  }

  console.error({
    message: error.message,
    stack: error.stack,
    path: req.originalUrl,
    method: req.method
  });

  return res.status(500).json({
    error: 'Algo deu errado no servidor',
    ...(env.nodeEnv !== 'production' ? { details: error.message } : {})
  });
}

module.exports = errorHandler;
