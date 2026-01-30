import { Router } from 'express';
import prisma from '../db';
import { startOfMonth, subMonths, format, subDays, startOfDay, endOfDay, eachDayOfInterval, parseISO } from 'date-fns';

const router = Router();

// Helper to get date range from query params
const getDateRange = (req: any) => {
  const { startDate, endDate, period } = req.query;
  const now = new Date();

  // If explicit dates differ, use them
  if (startDate && endDate) {
    return {
      start: startOfDay(parseISO(String(startDate))),
      end: endOfDay(parseISO(String(endDate)))
    };
  }

  // Fallback to period logic
  if (period === 'last-month') {
    return {
      start: startOfMonth(subMonths(now, 1)),
      end: startOfMonth(now)
    };
  }
  
  if (period === 'all-time') {
    return {
      start: new Date(0),
      end: now
    };
  }

  // Default: this-month
  return {
    start: startOfMonth(now),
    end: now
  };
};

// Financial metrics
router.get('/metrics', async (req, res) => {
  const { start, end } = getDateRange(req);

  try {
    const sales = await prisma.sale.findMany({ 
      where: {
        createdAt: {
          gte: start,
          lte: end // Use lte for inclusive end date
        },
        status: 'COMPLETED' // FILTER: Only completed sales
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

    const totalCost = sales.reduce((sum, sale) => {
      const saleCost = sale.items.reduce((itemSum, item) => {
        // Use historical cost if available, otherwise current product cost
        // Since we don't store historical cost in SaleItem, we assume specific business logic:
        // Ideally SaleItem should have costPrice, but here we fallback to product.costPrice
        const itemCost = item.product.costPrice;
        return itemSum + (itemCost * item.quantity);
      }, 0);
      return sum + saleCost;
    }, 0);

    const totalShippingCost = sales.reduce((sum, sale) => sum + (sale.shippingPrice || 0), 0);

    res.json({
      revenue: totalRevenue,
      profit: netProfit,
      salesCount: totalSales,
      costValue: totalCost,
      shippingCost: totalShippingCost
    });
  } catch (error) {
    console.error('Metrics error:', error);
    res.status(500).json({ error: 'Failed to fetch metrics' });
  }
});

// Revenue trend chart
router.get('/revenue-trend', async (req, res) => {
  const { start, end } = getDateRange(req);
  const data = [];

  try {
    // Generate all days in interval
    const days = eachDayOfInterval({ start, end });

    // Fetch all relevant sales once for performance (instead of in loop)
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        },
        status: 'COMPLETED'
      },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    // Bucket sales by day
    for (const day of days) {
      const dayStart = startOfDay(day);
      const dayEnd = endOfDay(day);

      const daySales = sales.filter(s => 
        s.createdAt >= dayStart && s.createdAt <= dayEnd
      );

      const revenue = daySales.reduce((sum, s) => sum + s.totalAmount, 0);
      const profit = daySales.reduce((sum, s) => sum + s.totalProfit, 0);
      const retailValue = daySales.reduce((sum, s) => {
        const saleRetail = s.items.reduce((itemSum, item) => {
          const itemRetail = item.product.retailPrice || item.price;
          return itemSum + (itemRetail * item.quantity);
        }, 0);
        return sum + saleRetail;
      }, 0);

      data.push({
        date: format(day, 'MMM dd'),
        fullDate: format(day, 'yyyy-MM-dd'), // Useful for debugging or sorting
        revenue,
        profit,
        retail: retailValue
      });
    }

    res.json(data);
  } catch (error) {
    console.error('Revenue trend error:', error);
    res.status(500).json({ error: 'Failed to fetch revenue trend' });
  }
});

// Low stock items (Status independent)
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

// Trending items (Filter by date & status)
router.get('/trending', async (req, res) => {
  const { start, end } = getDateRange(req);

  try {
    const saleItems = await prisma.saleItem.groupBy({
      by: ['productId'],
      where: {
        sale: {
          createdAt: {
            gte: start,
            lte: end
          },
          status: 'COMPLETED'
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

    res.json(trendingProducts.filter(p => p && p.name));
  } catch (error) {
    console.error('Trending error:', error);
    res.status(500).json({ error: 'Failed to fetch trending items' });
  }
});

// Peak hours (Filter by date & status)
router.get('/peak-hours', async (req, res) => {
  const { start, end } = getDateRange(req);
  
  try {
    const sales = await prisma.sale.findMany({
      where: {
        createdAt: {
          gte: start,
          lte: end
        },
        status: 'COMPLETED'
      },
      select: {
        createdAt: true
      }
    });

    const hoursMap = new Array(24).fill(0).map((_, i) => ({ hour: i, count: 0 }));
    for (const sale of sales) {
      // Need to adjust for local time if necessary, currently using server time
      const hour = new Date(sale.createdAt).getHours();
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

// Category Performance (Treemap/Pie) (Filter by date & status)
router.get('/category-performance', async (req, res) => {
  const { start, end } = getDateRange(req);

  try {
    // Improve: fetch only items in date range with completed status
    const saleItems = await prisma.saleItem.findMany({
      where: {
        sale: {
          createdAt: {
            gte: start,
            lte: end
          },
          status: 'COMPLETED'
        }
      },
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

    // Format: [{ name: 'Category', value: 1000 }] (changed 'size' to 'value' for generic charting, or keep size)
    // Keeping 'size' for treemap compatibility, but Pie might prefer value. Let's send both or use value.
    // User requested Pie Chart, Recharts Pie uses 'value' by default but can map dataKey. 
    // Let's stick to 'value' as it is more standard.
    const data = Object.entries(categoryMap).map(([name, value]) => ({
      name,
      value: value,
      size: value // Keep backward compat temporarily if needed, though we seem to be replacing the chart
    })).sort((a, b) => b.value - a.value);

    res.json(data);
  } catch (error) {
    console.error('Category performance error:', error);
    res.status(500).json({ error: 'Failed to fetch category performance' });
  }
});

export default router;
