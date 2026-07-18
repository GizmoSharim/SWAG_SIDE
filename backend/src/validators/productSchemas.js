const { z } = require('zod');

const imageSchema = z.union([
  z.string().url(),
  z.object({
    url: z.string().url(),
    alt: z.string().optional(),
    position: z.number().int().optional(),
    isMain: z.boolean().optional(),
    publicId: z.string().optional()
  })
]);

const productPayload = z.object({
  name: z.string().trim().min(2),
  description: z.string().trim().min(1),
  price: z.coerce.number().positive(),
  sizes: z.union([z.array(z.string()), z.string()]),
  colors: z.union([z.array(z.string()), z.string()]).optional(),
  stock: z.coerce.number().int().min(0).default(0),
  category: z.string().trim().min(1).default('Camisetas'),
  featured: z.coerce.boolean().default(false),
  active: z.coerce.boolean().default(true),
  images: z.union([z.array(imageSchema), z.string()]).optional()
});

const productSchema = z.object({ body: productPayload });
const productIdSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() })
});
const productUpdateSchema = z.object({
  params: z.object({ id: z.coerce.number().int().positive() }),
  body: productPayload
});

module.exports = { productSchema, productIdSchema, productUpdateSchema };
