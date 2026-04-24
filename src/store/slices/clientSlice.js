import { DEFAULT_CLIENTS, MEMBERSHIP_TIERS } from '@/defaults'

export const clientSlice = (set, get) => ({
  clients: structuredClone(DEFAULT_CLIENTS),

  addClient: (client) => {
    const id = Math.max(0, ...get().clients.map(c => c.id)) + 1
    set(s => ({ clients: [...s.clients, { ...client, id, visits: 0, totalSpent: 0, points: 0, tier: 'bronze' }] }))
    return id
  },

  updateClient: (id, updates) => {
    set(s => ({ clients: s.clients.map(c => c.id === id ? { ...c, ...updates } : c) }))
  },

  deleteClient: (id) => {
    set(s => ({ clients: s.clients.filter(c => c.id !== id) }))
  },

  importClients: (clients) => {
    set({ clients })
  },

  addPoints: (clientId, points) => {
    set(s => ({
      clients: s.clients.map(c => {
        if (c.id !== clientId) return c
        const newPoints = (c.points || 0) + points
        const newTier = MEMBERSHIP_TIERS.slice().reverse().find(t => c.totalSpent >= t.minSpent)?.id || 'bronze'
        return { ...c, points: newPoints, tier: newTier }
      })
    }))
  },

  redeemPoints: (clientId, points) => {
    set(s => ({
      clients: s.clients.map(c => c.id === clientId ? { ...c, points: Math.max(0, (c.points || 0) - points) } : c)
    }))
  },

  getClientTier: (clientId) => {
    const client = get().clients.find(c => c.id === clientId)
    if (!client) return MEMBERSHIP_TIERS[0]
    return MEMBERSHIP_TIERS.slice().reverse().find(t => client.totalSpent >= t.minSpent) || MEMBERSHIP_TIERS[0]
  },
})
