import Database from 'better-sqlite3'

const db = new Database('dev.db')

try {
  const insertProduct = db.prepare(`
    INSERT INTO Product (id, name, sku, stockQuantity, costPrice, retailPrice, salePrice, category, subCategory, createdAt)
    VALUES (@id, @name, @sku, @stockQuantity, @costPrice, @retailPrice, @salePrice, @category, @subCategory, @createdAt)
  `)

  const transaction = db.transaction((products) => {
    for (const product of products) insertProduct.run(product)
  })

  transaction([
    {
      id: crypto.randomUUID(),
      name: 'Raspberry Pi 4 Model B',
      sku: 'RPI-4B-8GB',
      stockQuantity: 100,
      costPrice: 55.0,
      retailPrice: 85.0,
      salePrice: 75.0,
      category: 'Components',
      subCategory: null,
      createdAt: new Date().toISOString()
    },
    {
      id: crypto.randomUUID(),
      name: 'Robot Car Kit (Advance)',
      sku: 'ROBOT-CAR-ADV',
      stockQuantity: 20,
      costPrice: 120.0,
      retailPrice: 200.0,
      salePrice: 180.0,
      category: 'Kits',
      subCategory: 'Advance',
      createdAt: new Date().toISOString()
    }
  ])

  console.log('Seeding completed successfully.')
} catch (error) {
  console.error('Seeding failed:', error)
} finally {
  db.close()
}
