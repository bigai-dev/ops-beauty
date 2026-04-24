import { DEFAULT_PROMOTIONS } from '@/defaults'

export const promotionSlice = (set, get) => ({
  promotions: structuredClone(DEFAULT_PROMOTIONS),

  addPromotion: (promo) => {
    const id = Math.max(0, ...get().promotions.map(p => p.id)) + 1
    set(s => ({ promotions: [...s.promotions, { ...promo, id, usageCount: 0 }] }))
    return id
  },

  updatePromotion: (id, updates) => {
    set(s => ({ promotions: s.promotions.map(p => p.id === id ? { ...p, ...updates } : p) }))
  },

  deletePromotion: (id) => {
    set(s => ({ promotions: s.promotions.filter(p => p.id !== id) }))
  },

  getActivePromotions: () => {
    const today = new Date().toISOString().slice(0, 10)
    return get().promotions.filter(p => p.active && p.startDate <= today && p.endDate >= today && (!p.maxUses || p.usageCount < p.maxUses))
  },

  validatePromoCode: (code, serviceId) => {
    const today = new Date().toISOString().slice(0, 10)
    const promo = get().promotions.find(p =>
      p.code.toUpperCase() === code.toUpperCase() && p.active && p.startDate <= today && p.endDate >= today && (!p.maxUses || p.usageCount < p.maxUses)
    )
    if (!promo) return null
    if (promo.services && promo.services.length > 0 && !promo.services.includes(serviceId)) return null
    return promo
  },

  applyPromotion: (promoId) => {
    set(s => ({
      promotions: s.promotions.map(p => p.id === promoId ? { ...p, usageCount: p.usageCount + 1 } : p)
    }))
  },

  importPromotions: (promotions) => { set({ promotions }) },
})
