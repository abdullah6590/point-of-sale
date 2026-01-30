import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Process a sale
router.post('/', async (req, res) => {
  const { cart, customerDetails, status = 'COMPLETED' } = req.body;
  const shippingPrice = customerDetails?.shippingPrice || 0;

  try {
    const result = await prisma.$transaction(async (tx: any) => {
      let subtotal = 0;
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

        // Use custom price if provided, otherwise use product's sale price
        const itemPrice = item.price !== undefined ? item.price : product.salePrice;
        const itemTotal = itemPrice * item.quantity;
        const itemProfit = (itemPrice - product.costPrice) * item.quantity;

        subtotal += itemTotal;
        totalProfit += itemProfit;

        saleItemsData.push({
          productId: item.productId,
          quantity: item.quantity,
          price: itemPrice,
          serialNumber: item.serialNumber || null
        });
      }

      // Total includes shipping
      const totalAmount = subtotal + shippingPrice;

      const sale = await tx.sale.create({
        data: {
          customerName: customerDetails?.customerName || null,
          customerPhone: customerDetails?.customerPhone || null,
          customerEmail: customerDetails?.customerEmail || null,
          customerAddress: customerDetails?.customerAddress || null,
          shippingPrice,
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

// Get sales with advanced filtering
router.get('/', async (req, res) => {
  const { status, search, startDate, endDate } = req.query;
  
  try {
    // Build where clause dynamically
    const where: any = {};
    
    // Status filter
    if (status) {
      where.status = String(status);
    }
    
    // Search filter (by ID or customer name)
    if (search) {
      const searchStr = String(search);
      where.OR = [
        { id: { contains: searchStr } },
        { customerName: { contains: searchStr, mode: 'insensitive' } },
        { customerEmail: { contains: searchStr, mode: 'insensitive' } },
      ];
    }
    
    // Date range filter
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        where.createdAt.gte = new Date(String(startDate));
      }
      if (endDate) {
        // Add 1 day to include the end date fully
        const end = new Date(String(endDate));
        end.setDate(end.getDate() + 1);
        where.createdAt.lt = end;
      }
    }
    
    const sales = await prisma.sale.findMany({
      where,
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
    console.error('Failed to fetch sales:', error);
    res.status(500).json({ error: 'Failed to fetch sales' });
  }
});

// Get single sale by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sale = await prisma.sale.findUnique({
      where: { id },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    if (!sale) {
      return res.status(404).json({ error: 'Sale not found' });
    }
    
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch sale' });
  }
});

// Update sale status (for refunds, cancellations)
router.patch('/:id/status', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  
  const validStatuses = ['COMPLETED', 'PENDING', 'CANCELLED', 'REFUNDED', 'QUOTATION', 'PARKED'];
  
  if (!status || !validStatuses.includes(status)) {
    return res.status(400).json({ error: 'Invalid status provided' });
  }
  
  try {
    const sale = await prisma.sale.update({
      where: { id },
      data: { status },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });
    
    res.json(sale);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update sale status' });
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

