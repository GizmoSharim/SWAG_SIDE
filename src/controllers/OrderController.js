const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const OrderController = {
  async store(req, res) {
    try {
      const { customerName, whatsapp, total, items } = req.body;

      // Salvamos o pedido para você não perder o controle das vendas
      const order = await prisma.order.create({
        data: {
          customerName,
          whatsapp,
          total,
          items, // Aqui salvamos a lista de roupas que ele escolheu
          status: "AGUARDANDO_WHATSAPP" 
        }
      });

      // Retornamos o ID do pedido. 
      // O Frontend vai usar esse ID para montar o link do WhatsApp
      return res.status(201).json(order);
    } catch (error) {
      console.error(error);
      return res.status(500).json({ error: "Erro ao registrar intenção de compra" });
    }
  }
};

module.exports = OrderController;