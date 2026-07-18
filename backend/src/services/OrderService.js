const prisma = require('../config/prisma');
const AppError = require('../utils/AppError');

const statusMap = {
  RECEIVED: 'RECEIVED',
  PAID: 'PAID',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELED: 'CANCELED',
  WAITING_WHATSAPP: 'WAITING_WHATSAPP'
};

function normalizeItem(item) {
  const unitPrice = Number(item.unitPrice ?? item.price);
  const quantity = Number(item.quantity);
  return {
    productId: item.productId || (Number.isInteger(Number(item.id)) ? Number(item.id) : null),
    name: item.name,
    size: item.size || item.selectedSize,
    color: item.color,
    quantity,
    unitPrice,
    subtotal: Number(item.subtotal ?? unitPrice * quantity)
  };
}

const OrderService = {
  async createOrder(data, userId) {
    const items = data.items.map(normalizeItem);
    const computedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);

    if (Math.abs(computedTotal - Number(data.total)) > 0.05) {
      throw new AppError('Total do pedido nao confere com os itens', 400, 'ORDER_TOTAL_INVALID');
    }

    return prisma.$transaction(async (tx) => {
      const order = await tx.order.create({
        data: {
          userId,
          customerName: data.customerName,
          email: data.email,
          whatsapp: data.whatsapp,
          total: Number(data.total),
          items: data.items,
          notes: data.notes,
          status: 'WAITING_WHATSAPP',
          orderItems: {
            create: items.map((item) => ({
              productId: item.productId,
              name: item.name,
              size: item.size,
              color: item.color,
              quantity: item.quantity,
              unitPrice: item.unitPrice,
              subtotal: item.subtotal
            }))
          },
          address: data.address ? {
            create: {
              ...data.address,
              name: data.customerName,
              userId
            }
          } : undefined,
          statusHistory: {
            create: {
              status: 'WAITING_WHATSAPP',
              note: 'Pedido iniciado pelo checkout WhatsApp',
              createdBy: userId
            }
          }
        },
        include: {
          orderItems: true,
          address: true,
          statusHistory: true
        }
      });

      return order;
    });
  },

  async listOrders() {
    return prisma.order.findMany({
      include: {
        orderItems: true,
        address: true,
        user: { select: { id: true, name: true, email: true } }
      },
      orderBy: { createdAt: 'desc' }
    });
  },

  async findById(id) {
    const order = await prisma.order.findUnique({
      where: { id },
      include: {
        orderItems: true,
        address: true,
        statusHistory: { orderBy: { createdAt: 'desc' } }
      }
    });

    if (!order) throw new AppError('Pedido nao encontrado', 404, 'ORDER_NOT_FOUND');
    return order;
  },

  async updateStatus(id, status, note, userId) {
    if (!statusMap[status]) throw new AppError('Status invalido', 400, 'ORDER_STATUS_INVALID');

    return prisma.order.update({
      where: { id },
      data: {
        status,
        statusHistory: {
          create: {
            status,
            note,
            createdBy: userId
          }
        }
      },
      include: {
        orderItems: true,
        address: true,
        statusHistory: { orderBy: { createdAt: 'desc' } }
      }
    });
  }
};

module.exports = OrderService;
