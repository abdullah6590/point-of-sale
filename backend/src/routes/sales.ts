import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Process a sale
router.post('/', async (req, res) => {
  const { cart, customerDetails, status = 'COMPLETED' } = req.body;

  try {
    const result = await prisma.$transaction(async (tx: any) => {
      let totalAmount = 0;
      let totalProfit = 0;
      const saleItemsData = [];

      for (const item of cart) {
        const product = await tx.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product with ID ${item.productId} not found`);
        }

        if (status === 'COMPLETED') {
          if (product.stockQuantity < item.quantity) {
            throw new Error(`Insufficient stock for product ${product.name}`);
          }

          await tx.product.update({
            where: { id: item.productId },
            data: { stockQuantity: product.stockQuantity - item.quantity },
          });
        }

        const itemTotal = product.salePrice * item.quantity;
        const itemProfit = (product.salePrice - product.costPrice) * item.quantity;

        totalAmount += itemTotal;
        totalProfit += itemProfit;

        saleItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: product.salePrice,
          serialNumber: item.serialNumber || null
        });
      }

      const sale = await tx.sale.create({
        data: {
          ...customerDetails,
          totalAmount,
          totalProfit,
          status,
          items: {
            create: saleItemsData,
          },
        },
        include: {
          items: {
            include: {
              product: true
            }
          },
        },
      });

      return sale;
    });

    res.json(result);
  } catch (error: any) {
    res.status(500).json({ error: error.message || 'Failed to process sale' });
  }
});

// Get sales by status
router.get('/', async (req, res) => {
  const { status } = req.query;
  try {
    const sales = await prisma.sale.findMany({
      where: status ? { status: String(status) } : {},
      include: {
        items: {
          include: {
            product: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Delete a sale
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await prisma.saleItem.deleteMany({
      where: { saleId: id }
    });
    const sale = await prisma.sale.delete({
      where: { id }
    });
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete sale' });
  }
});

export default router;
