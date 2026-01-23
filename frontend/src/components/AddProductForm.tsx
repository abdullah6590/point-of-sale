'use client'

import { useState } from 'react'
import { createProduct } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { Plus } from 'lucide-react'

export default function AddProductForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState('Components')
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    const formData = new FormData(e.currentTarget)
    
    try {
      await createProduct({
        name: formData.get('name') as string,
        sku: formData.get('sku') as string,
        stockQuantity: parseInt(formData.get('stockQuantity') as string),
        costPrice: parseFloat(formData.get('costPrice') as string),
        retailPrice: parseFloat(formData.get('retailPrice') as string),
        salePrice: parseFloat(formData.get('salePrice') as string),
        category: formData.get('category') as string,
        subCategory: formData.get('subCategory') as string || undefined,
      })
      
      // Reset form
      e.currentTarget.reset()
      setCategory('Components')
      router.refresh()
      alert('Product added successfully!')
    } catch (error: any) {
      alert('Error adding product: ' + error.message)
    } finally {
      setLoading(false)
    }
  }

  // Enterprise Input Classes
  const inputClasses = "w-full p-3 rounded-lg bg-[#F1F5F9] text-[#0F172A] placeholder-[#94A3B8] border border-transparent focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] outline-none transition-all text-sm"
  const labelClasses = "block text-xs font-medium text-[#64748B] mb-1.5"

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] p-6 mb-8"
    >
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-[#EFF6FF]">
          <Plus className="w-5 h-5 text-[#2563EB]" strokeWidth={2} />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#0F172A]">Add New Product</h2>
          <p className="text-sm text-[#64748B]">Fill in the product details below</p>
        </div>
      </div>
      
      {/* Form Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Basic Info Section */}
        <div>
          <label className={labelClasses}>Product Name *</label>
          <input 
            name="name" 
            placeholder="Enter product name" 
            required 
            className={inputClasses}
          />
        </div>
        
        <div>
          <label className={labelClasses}>SKU *</label>
          <input 
            name="sku" 
            placeholder="e.g. PRD-001" 
            required 
            className={inputClasses}
          />
        </div>
        
        <div>
          <label className={labelClasses}>Stock Quantity *</label>
          <input 
            name="stockQuantity" 
            type="number" 
            placeholder="0" 
            required 
            className={inputClasses}
          />
        </div>
        
        {/* Pricing Section */}
        <div>
          <label className={labelClasses}>Cost Price *</label>
          <input 
            name="costPrice" 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            required 
            className={inputClasses}
          />
        </div>
        
        <div>
          <label className={labelClasses}>Retail Price *</label>
          <input 
            name="retailPrice" 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            required 
            className={inputClasses}
          />
        </div>
        
        <div>
          <label className={labelClasses}>Sale Price *</label>
          <input 
            name="salePrice" 
            type="number" 
            step="0.01" 
            placeholder="0.00" 
            required 
            className={inputClasses}
          />
        </div>
        
        {/* Categories */}
        <div>
          <label className={labelClasses}>Category *</label>
          <select 
            name="category" 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className={inputClasses}
          >
            <option value="Components">Components</option>
            <option value="Kits">Kits</option>
          </select>
        </div>
        
        {category === 'Kits' && (
          <div>
            <label className={labelClasses}>Sub-Category</label>
            <select 
              name="subCategory" 
              className={inputClasses}
            >
              <option value="Advance">Advance</option>
              <option value="Basic">Basic</option>
              <option value="Component Kit">Component Kit</option>
            </select>
          </div>
        )}
      </div>

      {/* Submit Button */}
      <div className="mt-6 flex items-center gap-4">
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-3 bg-[#2563EB] text-white font-semibold rounded-lg shadow-[0_4px_6px_-1px_rgb(37_99_235/0.3)] hover:bg-[#1D4ED8] hover:shadow-[0_10px_15px_-3px_rgb(37_99_235/0.3)] disabled:bg-[#CBD5E1] disabled:text-[#94A3B8] disabled:shadow-none disabled:cursor-not-allowed transition-all duration-200"
        >
          {loading ? 'Adding...' : 'Add Product'}
        </button>
        <span className="text-xs text-[#94A3B8]">* Required fields</span>
      </div>
    </form>
  )
}
