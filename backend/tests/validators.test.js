const test = require('node:test');
const assert = require('node:assert/strict');
const { loginSchema, registerSchema } = require('../src/validators/authSchemas');
const { productSchema } = require('../src/validators/productSchemas');
const { createOrderSchema } = require('../src/validators/orderSchemas');

test('login schema accepts valid credentials', () => {
  const parsed = loginSchema.parse({
    body: {
      email: 'ADMIN@SWEGSIDE.COM',
      password: 'Admin@123456'
    }
  });

  assert.equal(parsed.body.email, 'admin@swegside.com');
});

test('register schema rejects weak passwords', () => {
  assert.throws(() => registerSchema.parse({
    body: {
      name: 'Cliente',
      email: 'cliente@swegside.com',
      password: '123'
    }
  }));
});

test('product schema normalizes numeric fields', () => {
  const parsed = productSchema.parse({
    body: {
      name: 'Camisa Oversized',
      description: 'Algodao pesado',
      price: '129.90',
      sizes: 'P, M, G',
      stock: '12',
      images: ['https://example.com/image.jpg']
    }
  });

  assert.equal(parsed.body.price, 129.9);
  assert.equal(parsed.body.stock, 12);
});

test('order schema requires at least one item', () => {
  assert.throws(() => createOrderSchema.parse({
    body: {
      customerName: 'Cliente',
      whatsapp: '5592992284048',
      total: 100,
      items: []
    }
  }));
});
