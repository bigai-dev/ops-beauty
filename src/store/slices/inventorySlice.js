import { DEFAULT_INVENTORY } from '@/defaults'

export const inventorySlice = (set, get) => ({
  inventory: structuredClone(DEFAULT_INVENTORY),

  addProduct: (product) => {
    const id = Math.max(0, ...get().inventory.map(p => p.id)) + 1
    set(s => ({ inventory: [...s.inventory, { ...product, id }] }))
    return id
  },

  updateProduct: (id, updates) => {
    set(s => ({ inventory: s.inventory.map(p => p.id === id ? { ...p, ...updates } : p) }))
  },

  deleteProduct: (id) => {
    set(s => ({ inventory: s.inventory.filter(p => p.id !== id) }))
  },

  adjustStock: (id, delta) => {
    set(s => ({ inventory: s.inventory.map(p => p.id === id ? { ...p, qty: Math.max(0, p.qty + delta) } : p) }))
  },

  importInventory: (inventory) => {
    set({ inventory })
  },

  getLowStockProducts: () => get().inventory.filter(p => p.qty <= p.lowStock),
  getLowStockCount: () => get().inventory.filter(p => p.qty <= p.lowStock).length,
})
