import { Router } from 'express';
import prisma from '../db';

const router = Router();

// Get all products
// Get all products or search
router.get('/', async (req, res) => {
  try {
    const { query } = req.query;
    let products;

    if (query && typeof query === 'string') {
      products = await prisma.product.findMany({
        where: {
          OR: [
            { name: { contains: query } }, // Case-insensitive not supported by SQLite by default without specific collation, but basic contains works.
            { sku: { contains: query } },
            { category: { contains: query } }
          ]
        }
      });
    } else {
      products = await prisma.product.findMany();
    }
    
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Create product
router.post('/', async (req, res) => {
  try {
    const product = await prisma.product.create({
      data: req.body,
    });
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

export default router;
