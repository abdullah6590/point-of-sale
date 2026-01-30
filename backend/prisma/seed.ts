import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clear existing data
  await prisma.saleItem.deleteMany()
  await prisma.sale.deleteMany()
  await prisma.product.deleteMany()
  await prisma.category.deleteMany()

  // Seed categories
  const categories = await prisma.category.createMany({
    data: [
      { name: 'Components' },
      { name: 'Kits' },
    ]
  })
  console.log(`Seeded ${categories.count} categories successfully!`)

  // Seed products
  const products = await prisma.product.createMany({
    data: [
      {
        name: 'Raspberry Pi 4 Model B (8GB)',
        sku: 'RPI-4B-8GB',
        stockQuantity: 50,
        costPrice: 55.0,
        retailPrice: 85.0,
        salePrice: 75.0,
        category: 'Components',
        subCategory: null,
      },
      {
        name: 'Arduino Uno R3',
        sku: 'ARD-UNO-R3',
        stockQuantity: 100,
        costPrice: 8.0,
        retailPrice: 25.0,
        salePrice: 20.0,
        category: 'Components',
        subCategory: null,
      },
      {
        name: 'ESP32 Development Board',
        sku: 'ESP32-DEV',
        stockQuantity: 75,
        costPrice: 5.0,
        retailPrice: 15.0,
        salePrice: 12.0,
        category: 'Components',
        subCategory: null,
      },
      {
        name: 'Robot Car Kit (Advance)',
        sku: 'ROBOT-CAR-ADV',
        stockQuantity: 20,
        costPrice: 120.0,
        retailPrice: 200.0,
        salePrice: 180.0,
        category: 'Kits',
        subCategory: 'Advance',
      },
      {
        name: 'LED Starter Kit',
        sku: 'LED-KIT-BASIC',
        stockQuantity: 150,
        costPrice: 10.0,
        retailPrice: 35.0,
        salePrice: 30.0,
        category: 'Kits',
        subCategory: 'Basic',
      },
      {
        name: 'Sensor Module Pack (10 pcs)',
        sku: 'SENSOR-10PK',
        stockQuantity: 40,
        costPrice: 15.0,
        retailPrice: 45.0,
        salePrice: 40.0,
        category: 'Components',
        subCategory: null,
      },
      {
        name: 'Breadboard (830 points)',
        sku: 'BB-830',
        stockQuantity: 200,
        costPrice: 2.0,
        retailPrice: 8.0,
        salePrice: 6.0,
        category: 'Components',
        subCategory: null,
      },
      {
        name: 'Jumper Wire Set (120 pcs)',
        sku: 'JUMPER-120',
        stockQuantity: 120,
        costPrice: 3.0,
        retailPrice: 12.0,
        salePrice: 10.0,
        category: 'Components',
        subCategory: null,
      },
    ],
  })

  console.log(`Seeded ${products.count} products successfully!`)
}

main()
  .catch((e) => {
    console.error('Seeding failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
