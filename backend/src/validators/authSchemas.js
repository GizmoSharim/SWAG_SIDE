const { z } = require('zod');

const registerSchema = z.object({
  body: z.object({
    name: z.string().trim().min(2),
    email: z.string().trim().email().toLowerCase(),
    whatsapp: z.string().trim().optional(),
    password: z.string().min(8)
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().trim().email().toLowerCase(),
    password: z.string().min(1)
  })
});

module.exports = { registerSchema, loginSchema };
