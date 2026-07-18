const OrderService = require('../services/OrderService');
const asyncHandler = require('../utils/asyncHandler');

const OrderController = {
  store: asyncHandler(async (req, res) => {
    const order = await OrderService.createOrder(req.body, req.user?.id);
    return res.status(201).json(order);
  }),

  index: asyncHandler(async (req, res) => {
    const orders = await OrderService.listOrders();
    return res.json(orders);
  }),

  show: asyncHandler(async (req, res) => {
    const order = await OrderService.findById(req.params.id);
    return res.json(order);
  }),

  updateStatus: asyncHandler(async (req, res) => {
    const order = await OrderService.updateStatus(
      req.params.id,
      req.body.status,
      req.body.note,
      req.user?.id
    );
    return res.json(order);
  })
};

module.exports = OrderController;
