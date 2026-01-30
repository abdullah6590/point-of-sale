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

// Update product
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { id: _id, ...data } = req.body; // Remove id from body if present
    
    const product = await prisma.product.update({
      where: { id },
      data: data,
    });
    res.json(product);
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    await prisma.product.delete({
      where: { id },
    });
    res.json({ message: 'Product deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
