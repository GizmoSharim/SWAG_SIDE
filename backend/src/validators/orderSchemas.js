const { z } = require('zod');

const orderItemSchema = z.object({
  productId: z.coerce.number().int().positive().optional(),
  id: z.union([z.string(), z.number()]).optional(),
  name: z.string().trim().min(1),
  price: z.coerce.number().positive(),
  unitPrice: z.coerce.number().positive().optional(),
  size: z.string().optional(),
  selectedSize: z.string().optional(),
  color: z.string().optional(),
  quantity: z.coerce.number().int().positive(),
  subtotal: z.coerce.number().positive().optional()
});

const addressSchema = z.object({
  street: z.string().trim().min(1),
  number: z.string().trim().min(1),
  complement: z.string().trim().optional(),
  neighborhood: z.string().trim().min(1),
  city: z.string().trim().min(1),
  state: z.string().trim().min(2).max(2),
  zip: z.string().trim().min(5)
}).optional();

const createOrderSchema = z.object({
  body: z.object({
    customerName: z.string().trim().min(2).default('Cliente WhatsApp'),
    email: z.string().trim().email().optional(),
    whatsapp: z.string().trim().min(8),
    total: z.coerce.number().positive(),
    items: z.array(orderItemSchema).min(1),
    address: addressSchema,
    notes: z.string().optional()
  })
});

const orderIdSchema = z.object({
  params: z.object({ id: z.string().uuid() })
});

const updateOrderStatusSchema = z.object({
  params: z.object({ id: z.string().uuid() }),
  body: z.object({
    status: z.enum(['RECEIVED', 'PAID', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELED', 'WAITING_WHATSAPP']),
    note: z.string().optional()
  })
});

module.exports = { createOrderSchema, orderIdSchema, updateOrderStatusSchema };
