'use client'

import { useState, useRef, useEffect } from 'react'
import type { Product } from '@/types'
import { Package, Tag, MoreHorizontal, Pencil, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { deleteProduct, updateProduct } from '@/app/actions'
import { formatCurrency } from '@/lib/utils'
import { Check, X as XIcon, ChevronUp, ChevronDown } from 'lucide-react'

// Extended type matching what the backend actually returns
type InventoryProduct = Pick<Product, 'id' | 'name' | 'category' | 'subCategory' | 'stockQuantity' | 'salePrice' | 'retailPrice' | 'costPrice' | 'imageUrl' | 'hasPromo' | 'discountType' | 'discountAmount'>

interface InventoryTableProps {
  products: InventoryProduct[]
  onEdit: (product: InventoryProduct) => void
}

export default function InventoryTable({ products, onEdit }: InventoryTableProps) {
  const router = useRouter()
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Stock Editing State
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState<number>(0)
  const [isSaving, setIsSaving] = useState(false)

  const startEditing = (product: InventoryProduct) => {
    setEditingId(product.id)
    setEditValue(product.stockQuantity)
    setOpenMenuId(null)
  }

  const cancelEditing = () => {
    setEditingId(null)
    setEditValue(0)
  }

  const saveStock = async () => {
    if (!editingId) return
    setIsSaving(true)
    try {
      await updateProduct(editingId, { stockQuantity: editValue })
      router.refresh()
      setEditingId(null)
    } catch (error) {
      alert('Failed to update stock')
    } finally {
      setIsSaving(false)
    }
  }

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpenMenuId(null)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await deleteProduct(deleteId)
      router.refresh()
    } catch (error) {
      alert('Failed to delete product')
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
    }
  }

  return (
    <>
      <div className="bg-white rounded-xl border border-[#E2E8F0] shadow-[0_4px_6px_-1px_rgb(0_0_0/0.05)] overflow-hidden min-h-[400px]">
        <table className="min-w-full text-left text-sm">
          {/* Table Header */}
          <thead className="bg-[#F8FAFC] border-b border-[#E2E8F0]">
            <tr>
              <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider w-16">
                Image
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Product Name
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Category
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider">
                Stock Status
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right">
                Price
              </th>
              <th className="px-6 py-4 text-xs font-semibold text-[#64748B] uppercase tracking-wider text-right w-16">
                Actions
              </th>
            </tr>
          </thead>
          
          {/* Table Body */}
          <tbody className="divide-y divide-[#F1F5F9]">
            {products.map((product) => (
              <tr 
                key={product.id} 
                className="hover:bg-[#F8FAFC] transition-colors group"
              >
                {/* Image */}
                <td className="px-6 py-4">
                  <div className="w-10 h-10 rounded-lg bg-[#F1F5F9] border border-[#E2E8F0] flex items-center justify-center overflow-hidden">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <Package className="w-5 h-5 text-[#94A3B8]" />
                    )}
                  </div>
                </td>

                {/* Product Name & Promo Badge */}
                <td className="px-6 py-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[#0F172A]">{product.name}</span>
                      {product.hasPromo && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-[#EFF6FF] text-[#2563EB] border border-[#BFDBFE]">
                          <Tag className="w-3 h-3" />
                          PROMO
                        </span>
                      )}
                    </div>
                    <div className="text-xs text-[#64748B] mt-0.5">
                      SKU: {product.name.substring(0, 3).toUpperCase()}-{product.id.substring(0, 6).toUpperCase()}
                    </div>
                  </div>
                </td>
                
                {/* Category */}
                <td className="px-6 py-4">
                  <div className="flex flex-col">
                    <span className="text-[#0F172A]">{product.category}</span>
                    {product.subCategory && (
                      <span className="text-xs text-[#94A3B8] mt-0.5">
                        {product.subCategory}
                      </span>
                    )}
                  </div>
                </td>
                
                {/* Stock Status - Pill Badge */}
                <td className="px-6 py-4">
                  {editingId === product.id ? (
                    <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                       <div className="flex items-center border border-[#E2E8F0] rounded-lg bg-white overflow-hidden shadow-sm">
                         <button 
                           onClick={() => setEditValue(Math.max(0, editValue - 1))}
                           className="px-2 py-1.5 hover:bg-[#F1F5F9] border-r border-[#E2E8F0] text-[#64748B]"
                         >
                           <ChevronDown className="w-3 h-3" />
                         </button>
                         <input 
                           type="number" 
                           value={editValue}
                           onChange={(e) => setEditValue(Math.max(0, parseInt(e.target.value) || 0))}
                           className="w-12 text-center text-sm font-medium py-1 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                         />
                         <button 
                           onClick={() => setEditValue(editValue + 1)}
                           className="px-2 py-1.5 hover:bg-[#F1F5F9] border-l border-[#E2E8F0] text-[#64748B]"
                         >
                           <ChevronUp className="w-3 h-3" />
                         </button>
                       </div>
                       
                       <button 
                         onClick={saveStock}
                         disabled={isSaving}
                         className="p-1.5 bg-[#22C55E] text-white rounded-lg hover:bg-[#16A34A] shadow-sm disabled:opacity-50"
                       >
                         <Check className="w-3 h-3" />
                       </button>
                       <button 
                         onClick={cancelEditing}
                         disabled={isSaving}
                         className="p-1.5 bg-[#F1F5F9] text-[#64748B] rounded-lg hover:bg-[#E2E8F0]"
                       >
                         <XIcon className="w-3 h-3" />
                       </button>
                    </div>
                  ) : (
                    <div 
                      className="group/stock cursor-pointer relative inline-block"
                      onClick={() => startEditing(product)}
                      title="Click to edit stock"
                    >
                      {product.stockQuantity < 5 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEE2E2] text-[#991B1B]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626]"></span>
                          Low ({product.stockQuantity})
                        </span>
                      ) : product.stockQuantity < 20 ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#FEF3C7] text-[#854D0E]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#CA8A04]"></span>
                          Ltd ({product.stockQuantity})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-[#DCFCE7] text-[#166534]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#16A34A]"></span>
                          In Stock ({product.stockQuantity})
                        </span>
                      )}
                      
                      {/* Hint Icon */}
                      <div className="absolute -right-5 top-1/2 -translate-y-1/2 opacity-0 group-hover/stock:opacity-100 transition-opacity">
                        <Pencil className="w-3 h-3 text-[#94A3B8]" />
                      </div>
                    </div>
                  )}
                </td>
                
                {/* Price Display */}
                <td className="px-6 py-4 text-right">
                  <div className="flex flex-col items-end">
                    <span className="font-bold text-[#0F172A]">
                      {formatCurrency(product.salePrice)}
                    </span>
                    {product.retailPrice > product.salePrice && (
                      <span className="text-xs text-[#94A3B8] line-through decoration-red-500/50">
                        {formatCurrency(product.retailPrice)}
                      </span>
                    )}
                  </div>
                </td>

                {/* Actions */}
                <td className="px-6 py-4 text-right relative">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      setOpenMenuId(openMenuId === product.id ? null : product.id)
                    }}
                    className="p-1.5 text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-md transition-colors"
                  >
                    <MoreHorizontal className="w-5 h-5" />
                  </button>

                  {/* Custom Dropdown Menu */}
                  {openMenuId === product.id && (
                    <div 
                      ref={menuRef}
                      className="absolute right-8 top-8 w-40 bg-white rounded-lg shadow-xl border border-[#E2E8F0] z-50 animate-in fade-in zoom-in-95 duration-100"
                    >
                      <div className="py-1">
                        <button 
                          onClick={() => {
                            onEdit(product)
                            setOpenMenuId(null)
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-[#0F172A] hover:bg-[#F8FAFC] flex items-center gap-2"
                        >
                          <Pencil className="w-4 h-4 text-[#64748B]" />
                          Edit
                        </button>
                        <button 
                          onClick={() => {
                            setDeleteId(product.id)
                            setOpenMenuId(null)
                          }}
                          className="w-full text-left px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {/* Empty State */}
        {products.length === 0 && (
          <div className="p-12 text-center">
            <div className="w-16 h-16 mx-auto rounded-full bg-[#F1F5F9] flex items-center justify-center mb-4">
              <span className="text-2xl">📦</span>
            </div>
            <p className="text-[#64748B] font-medium">No products found</p>
            <p className="text-[#94A3B8] text-sm mt-1">Add your first product to get started</p>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-6 animate-in zoom-in-95 duration-200">
            <h3 className="text-lg font-bold text-[#0F172A] mb-2">Delete Product?</h3>
            <p className="text-[#64748B] text-sm mb-6">
              Are you sure you want to delete this product? This action cannot be undone and will remove the item from stock permanently.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm font-medium text-[#64748B] hover:text-[#0F172A] hover:bg-[#F1F5F9] rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete}
                disabled={isDeleting}
                className="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors flex items-center gap-2"
              >
                {isDeleting ? 'Deleting...' : 'Delete Product'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
