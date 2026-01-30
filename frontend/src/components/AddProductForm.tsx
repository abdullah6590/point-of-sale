'use client'

import { useState, useEffect, useRef } from 'react'
import { createProduct, updateProduct } from '@/app/actions'
import { useRouter } from 'next/navigation'
import { Plus, Upload, X, DollarSign, Percent, Calendar } from 'lucide-react'
import Image from 'next/image'
import type { Product } from '@/types'

const convertToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = error => reject(error)
  })
}

interface AddProductFormProps {
  initialData?: Product
  onSuccess?: () => void
  onCancel?: () => void
}

// Helper to generate abbreviation (e.g., "Kit" -> "KT")
const generateCategoryAbbreviation = (category: string) => {
  if (!category) return ''
  // Remove vowels (except maybe first letter if needed, but for "Kit"->"KT" logic, removing all vowels matches)
  // Actually, K i t -> K t.
  // Basic -> B s c -> B S
  // Advance -> A d v n c -> A D
  const withoutVowels = category.replace(/[aeiou\s]/gi, '')
  // If result is too short (e.g. for "I"), use original
  const base = withoutVowels.length < 2 ? category : withoutVowels
  return base.substring(0, 2).toUpperCase()
}

export default function AddProductForm({ initialData, onSuccess, onCancel }: AddProductFormProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const isEditMode = !!initialData
  
  // Image State
  const [imagePreview, setImagePreview] = useState<string | null>(initialData?.imageUrl || null)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Category State
  const [categories, setCategories] = useState<{id: string, name: string}[]>([])
  const [selectedCategory, setSelectedCategory] = useState(initialData?.category || '')
  const [isAddingCategory, setIsAddingCategory] = useState(false)
  const [newCategoryName, setNewCategoryName] = useState('')

  // SKU State
  const [sku, setSku] = useState(initialData?.sku || '')

  // Pricing & Promo State
  const [prices, setPrices] = useState({ 
    cost: initialData?.costPrice?.toString() || '', 
    retail: initialData?.retailPrice?.toString() || '', 
    sale: initialData?.salePrice?.toString() || '' 
  })
  const [hasPromo, setHasPromo] = useState(initialData?.hasPromo || false)
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>(initialData?.discountType || 'percentage')
  const [discountAmount, setDiscountAmount] = useState(initialData?.discountAmount?.toString() || '')

  useEffect(() => {
    fetchCategories()
  }, [])
  
  // Auto-generate SKU start value when category changes
  useEffect(() => {
    // Only auto-generate if adding new product or SKU is empty/looks like a prefix
    if (!isEditMode && selectedCategory) {
       const abbreviation = generateCategoryAbbreviation(selectedCategory)
       if (abbreviation) {
         // If SKU is empty, set it
         if (!sku) {
           setSku(abbreviation + '-')
         } else {
           // Optional: If SKU currently matches another category prefix, replace it?
           // For now, let's just set it if empty to represent "generating start value"
           // Or if the user hasn't typed anything meaningful yet (length <= 3)
           if (sku.length <= 3) {
             setSku(abbreviation + '-')
           }
         }
       }
    }
  }, [selectedCategory, isEditMode])

  const fetchCategories = async () => {
    try {
      const res = await fetch('http://localhost:3001/api/categories')
      if (res.ok) {
        const data = await res.json()
        setCategories(data)
        if (data.length > 0 && !selectedCategory && !initialData) {
          setSelectedCategory(data[0].name)
        }
      }
    } catch (err) {
      console.error('Failed to fetch categories', err)
    }
  }

  const handleImageSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('Image size should be less than 5MB')
        return
      }
      setImageFile(file)
      const base64 = await convertToBase64(file)
      setImagePreview(base64)
    }
  }

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) return
    try {
      const res = await fetch('http://localhost:3001/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newCategoryName })
      })
      if (res.ok) {
        const newCat = await res.json()
        setCategories([...categories, newCat])
        setSelectedCategory(newCat.name)
        setIsAddingCategory(false)
        setNewCategoryName('')
      }
    } catch (err) {
      alert('Failed to create category')
    }
  }

  // Auto-calculate sale price when promo changes
  useEffect(() => {
    if (hasPromo && prices.retail) {
      const retail = parseFloat(prices.retail)
      const discount = parseFloat(discountAmount) || 0
      
      if (!isNaN(retail)) {
        let newSalePrice = retail
        if (discountType === 'percentage') {
          newSalePrice = retail - (retail * (discount / 100))
        } else {
          newSalePrice = retail - discount
        }
        setPrices(prev => ({ ...prev, sale: Math.max(0, newSalePrice).toFixed(2) }))
      }
    } else if (!hasPromo && prices.retail && !prices.sale) {
      // If promo turned off and no sale price set, default to retail
      setPrices(prev => ({ ...prev, sale: prev.retail }))
    }
  }, [hasPromo, discountType, discountAmount, prices.retail])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    
    // Validation
    if (parseFloat(prices.sale) > parseFloat(prices.retail)) {
      alert('Sale price cannot be higher than Retail price')
      setLoading(false)
      return
    }

    const formData = new FormData(e.currentTarget)
    
    try {
      let imageUrl = imagePreview || undefined // Keep existing URL if no new file
      if (imageFile) {
        imageUrl = await convertToBase64(imageFile)
      }

      const productData = {
        name: formData.get('name') as string,
        sku: sku, // Use controlled value
        stockQuantity: parseInt(formData.get('stockQuantity') as string),
        costPrice: parseFloat(prices.cost),
        retailPrice: parseFloat(prices.retail),
        salePrice: parseFloat(prices.sale),
        category: selectedCategory,
        subCategory: formData.get('subCategory') as string || undefined,
        imageUrl,
        hasPromo,
        discountType: hasPromo ? discountType : undefined,
        discountAmount: hasPromo ? parseFloat(discountAmount) : undefined,
        promoStartDate: formData.get('promoStartDate') as string || undefined,
        promoEndDate: formData.get('promoEndDate') as string || undefined,
      }

      if (isEditMode && initialData) {
        await updateProduct(initialData.id, productData as any)
        alert('Product updated successfully!')
      } else {
        await createProduct(productData as any)
        alert('Product added successfully!')
      }
      
      router.refresh()
      
      if (onSuccess) {
        onSuccess()
      } else {
        // Reset form if not in modal/sheet
        if (!isEditMode) {
            e.currentTarget.reset()
            setImageFile(null)
            setImagePreview(null)
            setCategories([]) // Refresh? No, keep categories
            fetchCategories()
            setSku('') // Reset SKU
            setPrices({ cost: '', retail: '', sale: '' })
            setHasPromo(false)
            setDiscountAmount('')
        }
      }

    } catch (error: any) {
      alert(`Error ${isEditMode ? 'updating' : 'adding'} product: ` + error.message)
    } finally {
      setLoading(false)
    }
  }

  const inputClasses = "w-full p-3 rounded-lg bg-[#F1F5F9] text-[#0F172A] placeholder-[#94A3B8] border border-transparent focus:bg-white focus:border-[#2563EB] focus:ring-2 focus:ring-[#DBEAFE] outline-none transition-all text-sm"
  const labelClasses = "block text-xs font-medium text-[#64748B] mb-1.5"

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] p-6 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-[#0F172A]">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        {onCancel && (
          <button type="button" onClick={onCancel} className="text-[#64748B] hover:text-[#0F172A]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column - Image Upload */}
        <div className="lg:w-1/4">
          <label className="block text-sm font-medium text-[#0F172A] mb-3">Product Image</label>
          <div 
            className={`border-2 border-dashed rounded-xl h-64 flex flex-col items-center justify-center cursor-pointer transition-all ${
              imagePreview ? 'border-[#2563EB] bg-[#EFF6FF]' : 'border-[#CBD5E1] hover:border-[#94A3B8] hover:bg-[#F8FAFC]'
            }`}
            onClick={() => fileInputRef.current?.click()}
          >
            {imagePreview ? (
              <div className="relative w-full h-full p-2 group">
                <img 
                  src={imagePreview} 
                  alt="Preview" 
                  className="w-full h-full object-contain rounded-lg"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                  <span className="text-white text-sm font-medium">Change Image</span>
                </div>
              </div>
            ) : (
              <div className="text-center p-4">
                <div className="w-12 h-12 bg-[#F1F5F9] rounded-full flex items-center justify-center mx-auto mb-3 text-[#64748B]">
                  <Upload className="w-6 h-6" />
                </div>
                <p className="text-sm font-medium text-[#0F172A]">Click to upload</p>
                <p className="text-xs text-[#64748B] mt-1">SVG, PNG, JPG (max 5MB)</p>
              </div>
            )}
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden"
              onChange={handleImageSelect}
            />
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex-1 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className={labelClasses}>Product Name *</label>
              <input 
                name="name" 
                defaultValue={initialData?.name}
                placeholder="Enter product name" 
                required 
                className={inputClasses} 
              />
            </div>
            <div>
              <label className={labelClasses}>SKU *</label>
              <input 
                name="sku" 
                value={sku}
                onChange={e => setSku(e.target.value)}
                placeholder="e.g. KT-001" 
                required 
                className={inputClasses} 
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category with Dynamic Add */}
            <div>
              <label className={labelClasses}>Category *</label>
              {isAddingCategory ? (
                <div className="flex gap-2">
                  <input 
                    autoFocus
                    value={newCategoryName}
                    onChange={e => setNewCategoryName(e.target.value)}
                    placeholder="New category name"
                    className={inputClasses}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleCreateCategory())}
                  />
                  <button type="button" onClick={handleCreateCategory} className="p-2 bg-[#2563EB] text-white rounded-lg hover:bg-[#1D4ED8]">
                    <Plus className="w-5 h-5" />
                  </button>
                  <button type="button" onClick={() => setIsAddingCategory(false)} className="p-2 bg-[#F1F5F9] text-[#64748B] rounded-lg hover:bg-[#E2E8F0]">
                    <X className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select 
                    value={selectedCategory} 
                    onChange={e => setSelectedCategory(e.target.value)}
                    className={inputClasses}
                  >
                    {categories.length === 0 && <option value="">No categories</option>}
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.name}>{cat.name}</option>
                    ))}
                  </select>
                  <button 
                    type="button" 
                    onClick={() => setIsAddingCategory(true)}
                    className="p-2.5 bg-[#F1F5F9] text-[#64748B] rounded-lg border border-[#E2E8F0] hover:bg-[#E2E8F0] hover:text-[#0F172A] transition-colors"
                    title="Add new category"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              )}
            </div>

            <div>
              <label className={labelClasses}>Sub-Category</label>
              <select name="subCategory" defaultValue={initialData?.subCategory || ''} className={inputClasses}>
                <option value="">None</option>
                <option value="Advance">Advance</option>
                <option value="Basic">Basic</option>
                <option value="Component Kit">Component Kit</option>
              </select>
            </div>

            <div>
              <label className={labelClasses}>Stock Quantity *</label>
              <input 
                name="stockQuantity" 
                type="number" 
                defaultValue={initialData?.stockQuantity}
                placeholder="0" 
                required 
                className={inputClasses} 
              />
            </div>
          </div>

          <div className="border-t border-[#E2E8F0] pt-6">
            <h3 className="text-sm font-bold text-[#0F172A] mb-4 flex items-center gap-2">
              <DollarSign className="w-4 h-4 text-[#2563EB]" /> Pricing & Promotions
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className={labelClasses}>Cost Price *</label>
                <input 
                  type="number" step="0.01" required placeholder="0.00" className={inputClasses}
                  value={prices.cost}
                  onChange={e => setPrices({...prices, cost: e.target.value})}
                />
              </div>
              <div>
                <label className={labelClasses}>Retail Price *</label>
                <input 
                  type="number" step="0.01" required placeholder="0.00" className={inputClasses}
                  value={prices.retail}
                  onChange={e => setPrices({...prices, retail: e.target.value})}
                />
              </div>
              <div>
                <label className={labelClasses}>Sale Price *</label>
                <input 
                  type="number" step="0.01" required placeholder="0.00" 
                  className={`${inputClasses} ${
                    parseFloat(prices.sale) > parseFloat(prices.retail) ? 'border-red-500 focus:border-red-500 ring-red-100' : ''
                  }`}
                  value={prices.sale}
                  onChange={e => setPrices({...prices, sale: e.target.value})}
                />
                {parseFloat(prices.sale) > parseFloat(prices.retail) && (
                  <p className="text-xs text-red-500 mt-1">Cannot be higher than Retail Price</p>
                )}
              </div>
            </div>

            <div className="bg-[#F8FAFC] rounded-lg p-4 border border-[#E2E8F0]">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-[#0F172A]">Run Promotion?</span>
                <button
                  type="button"
                  onClick={() => setHasPromo(!hasPromo)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:ring-offset-2 ${
                    hasPromo ? 'bg-[#2563EB]' : 'bg-[#CBD5E1]'
                  }`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    hasPromo ? 'translate-x-6' : 'translate-x-1'
                  }`} />
                </button>
              </div>

              {hasPromo && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                  <div>
                    <label className={labelClasses}>Discount Type</label>
                    <div className="flex rounded-lg border border-[#E2E8F0] p-1 bg-white">
                      <button
                        type="button"
                        onClick={() => setDiscountType('percentage')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                          discountType === 'percentage' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        Percentage (%)
                      </button>
                      <button
                        type="button"
                        onClick={() => setDiscountType('fixed')}
                        className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-all ${
                          discountType === 'fixed' ? 'bg-[#EFF6FF] text-[#2563EB]' : 'text-[#64748B] hover:bg-[#F1F5F9]'
                        }`}
                      >
                        Fixed Amount (Rs.)
                      </button>
                    </div>
                  </div>
                  
                  <div>
                    <label className={labelClasses}>Discount Amount</label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={discountAmount}
                        onChange={e => setDiscountAmount(e.target.value)}
                        placeholder="0" 
                        className={`${inputClasses} pl-8`}
                      />
                      <div className="absolute left-3 top-3 text-[#94A3B8]">
                        {discountType === 'percentage' ? <Percent className="w-4 h-4" /> : <DollarSign className="w-4 h-4" />}
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>Start Date</label>
                    <div className="relative">
                      <input 
                        name="promoStartDate" 
                        type="date" 
                        defaultValue={initialData?.promoStartDate ? new Date(initialData.promoStartDate).toISOString().split('T')[0] : ''}
                        className={`${inputClasses} pl-9 text-xs`} 
                      />
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8]" />
                    </div>
                  </div>

                  <div>
                    <label className={labelClasses}>End Date</label>
                    <div className="relative">
                      <input 
                        name="promoEndDate" 
                        type="date" 
                        defaultValue={initialData?.promoEndDate ? new Date(initialData.promoEndDate).toISOString().split('T')[0] : ''}
                        className={`${inputClasses} pl-9 text-xs`} 
                      />
                      <Calendar className="absolute left-3 top-2.5 w-4 h-4 text-[#94A3B8]" />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 pt-6 border-t border-[#E2E8F0] flex justify-end gap-3">
        <button 
          type="button"
          onClick={() => onCancel ? onCancel() : router.push('/')}
          className="px-6 py-2.5 text-[#64748B] font-medium hover:text-[#0F172A] transition-colors"
        >
          Cancel
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="px-6 py-2.5 bg-[#2563EB] text-white font-semibold rounded-lg shadow-sm hover:bg-[#1D4ED8] disabled:opacity-50 disabled:cursor-not-allowed transition-all"
        >
          {loading ? (isEditMode ? 'Updating...' : 'Creating...') : (isEditMode ? 'Update Product' : 'Create Product')}
        </button>
      </div>
    </form>
  )
}
