import { Router } from 'express';
import prisma from '../db';
import { startOfMonth, subMonths, format, subDays, startOfDay } from 'date-fns';

const router = Router();

// Financial metrics
router.get('/metrics', async (req, res) => {
  const { period = 'this-month' } = req.query;
  const now = new Date();
  let startDate = startOfMonth(now);
  let endDate = new Date(now);
  
  if (period === 'last-month') {
    startDate = startOfMonth(subMonths(now, 1));
    endDate = startOfMonth(now);
  } else if (period === 'all-time') {
    startDate = new Date(0);
  }

  try {
    const sales = await prisma.sale.findMany({ 
      where: {
        createdAt: {
          gte: startDate,
          lt: endDate
        }
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    const totalRevenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
    const netProfit = sales.reduce((sum, sale) => sum + sale.totalProfit, 0);
    const totalSales = sales.length;

    const totalRetail = sales.reduce((sum, sale) => {
      const saleRetail = sale.items.reduce((itemSum, item) => {
        const itemRetail = item.product.retailPrice || item.price;
        return itemSum + (itemRetail * item.quantity);
      }, 0);
      return sum + saleRetail;
    }, 0);

    res.json({
      revenue: totalRevenue,
      profit: netProfit,
      salesCount: totalSales,
      retailValue: totalRetail
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Revenue trend chart
router.get('/revenue-trend', async (req, res) => {
  const today = new Date();
  const data = [];

  try {
    for (let i = 6; i >= 0; i--) {
      const date = subDays(today, i);
      const start = startOfDay(date);
      const end = startOfDay(subDays(date, -1));
      
      const sales = await prisma.sale.findMany({
        where: {
          createdAt: {
            gte: start,
            lt: end
          }
        },
        include: {
          items: {
            include: {
              product: true
            }
          }
        }
      });

      const revenue = sales.reduce((sum, sale) => sum + sale.totalAmount, 0);
      const profit = sales.reduce((sum, sale) => sum + sale.totalProfit, 0);
      const retailValue = sales.reduce((sum, sale) => {
        const saleRetail = sale.items.reduce((itemSum, item) => {
          const itemRetail = item.product.retailPrice || item.price;
          return itemSum + (itemRetail * item.quantity);
        }, 0);
        return sum + saleRetail;
      }, 0);

      data.push({
        date: format(date, 'MMM dd'),
        revenue,
        profit,
        retail: retailValue
      });
    }
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch revenue trend' });
  }
});

// Low stock items
router.get('/low-stock', async (req, res) => {
  try {
    const items = await prisma.product.findMany({
      where: {
        stockQuantity: {
          lte: 5
        }
      },
      take: 10,
      orderBy: {
        stockQuantity: 'asc'
      }
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch low stock items' });
  }
});

// Trending items
router.get('/trending', async (req, res) => {
  const thirtyDaysAgo = subMonths(new Date(), 1);
  try {
    const saleItems = await prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          createdAt: {
            gte: thirtyDaysAgo
          }
        }
      },
      _sum: {
        quantity: true
      },
      orderBy: {
        _sum: {
          quantity: 'desc'
        }
      },
      take: 5
    });

    const trendingProducts = await Promise.all(saleItems.map(async (item) => {
      const product = await prisma.product.findUnique({
        where: { id: item.productId }
      });
      return {
        ...product,
        soldQuantity: item._sum.quantity
      };
    }));

    res.json(trendingProducts.filter(p => p.name));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch trending items' });
  }
});

// Peak hours
router.get('/peak-hours', async (req, res) => {
  const sevenDaysAgo = subDays(new Date(), 7);
  try {
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: sevenDaysAgo
        }
      },
      select: {
        createdAt: true
      }
    });

    const hoursMap = new Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 }));
    for (const sale of sales) {
      const hour = sale.createdAt.getHours();
      hoursMap[hour].count += 1;
    }

    res.json(hoursMap.map(h => ({
      hour: `${h.hour.toString().padStart(2, '0')}:00`,
      sales: h.count
    })));
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch peak hours' });
  }
});

// Category Performance (Treemap)
router.get('/category-performance', async (req, res) => {
  try {
    // We need to group by product > category
    // SQLite/Prisma grouping is limited, so we fetch and aggregate in JS for flexibility
    // In a real Postgres app, we'd use raw SQL or robust groupBy
    const saleItems = await prisma.saleItem.findMany({
      include: {
        product: true
      }
    });

    const categoryMap: { [key: string]: number } = {};

    for (const item of saleItems) {
      if (item.product && item.product.category) {
        const cat = item.product.category;
        const revenue = item.quantity * item.price;
        categoryMap[cat] = (categoryMap[cat] || 0) + revenue;
      }
    }

    // Format for Recharts Treemap: [{ name: 'Category', size: 1000 }]
    const data = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      size: value
    })).sort((a, b) => b.size - a.size); // Sort by highest revenue

    res.json(data);
  } catch (error) {
    console.error('Category performance error:', error);
    res.status(500).json({ error: 'Failed to fetch category performance' });
  }
});

export default router;
