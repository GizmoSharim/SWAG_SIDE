const express = require('express');
const multer = require('multer');
const router = express.Router();

const AuthController = require('../controllers/AuthController');
const ProductController = require('../controllers/ProductController');
const OrderController = require('../controllers/OrderController');
const UploadController = require('../controllers/UploadController');
const validate = require('../middlewares/validate');
const { authenticate, authorize } = require('../middlewares/auth');
const { registerSchema, loginSchema } = require('../validators/authSchemas');
const { productSchema, productIdSchema, productUpdateSchema } = require('../validators/productSchemas');
const { createOrderSchema, orderIdSchema, updateOrderStatusSchema } = require('../validators/orderSchemas');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024, files: 8 }
});

router.get('/health', (req, res) => res.json({ ok: true }));

router.post('/auth/register', validate(registerSchema), AuthController.register);
router.post('/auth/login', validate(loginSchema), AuthController.login);
router.post('/auth/refresh', AuthController.refresh);
router.post('/auth/logout', AuthController.logout);
router.get('/auth/me', authenticate, AuthController.me);

router.get('/products', ProductController.index);
router.get('/products/:id', validate(productIdSchema), ProductController.show);
router.post('/products', authenticate, authorize('ADMIN'), validate(productSchema), ProductController.store);
router.put('/products/:id', authenticate, authorize('ADMIN'), validate(productUpdateSchema), ProductController.update);
router.delete('/products/:id', authenticate, authorize('ADMIN'), validate(productIdSchema), ProductController.delete);

router.post('/orders', validate(createOrderSchema), OrderController.store);
router.get('/orders', authenticate, authorize('ADMIN'), OrderController.index);
router.get('/orders/:id', authenticate, authorize('ADMIN'), validate(orderIdSchema), OrderController.show);
router.patch('/orders/:id/status', authenticate, authorize('ADMIN'), validate(updateOrderStatusSchema), OrderController.updateStatus);

router.post(
  '/uploads/images',
  authenticate,
  authorize('ADMIN'),
  upload.array('images', 8),
  UploadController.uploadImages
);

module.exports = router;
