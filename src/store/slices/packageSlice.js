import { DEFAULT_PACKAGE_TEMPLATES, DEFAULT_CLIENT_PACKAGES, MEMBERSHIP_TIERS } from '@/defaults'

export const packageSlice = (set, get) => ({
  packageTemplates: structuredClone(DEFAULT_PACKAGE_TEMPLATES),
  clientPackages: structuredClone(DEFAULT_CLIENT_PACKAGES),

  addPackageTemplate: (tpl) => {
    const id = Math.max(0, ...get().packageTemplates.map(p => p.id)) + 1
    set(s => ({ packageTemplates: [...s.packageTemplates, { ...tpl, id }] }))
    return id
  },

  updatePackageTemplate: (id, updates) => {
    set(s => ({ packageTemplates: s.packageTemplates.map(p => p.id === id ? { ...p, ...updates } : p) }))
  },

  deletePackageTemplate: (id) => {
    set(s => ({ packageTemplates: s.packageTemplates.filter(p => p.id !== id) }))
  },

  purchasePackage: (clientId, templateId) => {
    const tpl = get().packageTemplates.find(p => p.id === templateId)
    if (!tpl) return
    const id = Math.max(0, ...get().clientPackages.map(p => p.id)) + 1
    const today = new Date().toISOString().slice(0, 10)
    const expiry = new Date(Date.now() + tpl.validDays * 86400000).toISOString().slice(0, 10)
    set(s => ({
      clientPackages: [...s.clientPackages, {
        id, clientId, templateId, purchaseDate: today, expiryDate: expiry,
        totalSessions: tpl.sessions, usedSessions: 0, amountPaid: tpl.price,
      }]
    }))

    // Update client metrics — totalSpent, points, tier
    const client = get().clients.find(c => c.id === clientId)
    if (client) {
      const newTotalSpent = client.totalSpent + tpl.price
      const newTier = MEMBERSHIP_TIERS.slice().reverse().find(t => newTotalSpent >= t.minSpent)?.id || 'bronze'
      const tierMultiplier = MEMBERSHIP_TIERS.find(t => t.id === newTier)?.pointsMultiplier || 1
      const earnedPoints = Math.round(tpl.price * 0.1 * tierMultiplier)

      set(s => ({
        clients: s.clients.map(c => c.id === clientId ? {
          ...c,
          totalSpent: newTotalSpent,
          points: (c.points || 0) + earnedPoints,
          tier: newTier,
        } : c)
      }))
    }
  },

  usePackageSession: (clientPackageId) => {
    set(s => ({
      clientPackages: s.clientPackages.map(p =>
        p.id === clientPackageId ? { ...p, usedSessions: p.usedSessions + 1 } : p
      )
    }))
  },

  getClientPackages: (clientId) => {
    return get().clientPackages.filter(p => p.clientId === clientId)
  },

  importPackageTemplates: (templates) => { set({ packageTemplates: templates }) },
  importClientPackages: (packages) => { set({ clientPackages: packages }) },
})
