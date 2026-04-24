import { DEFAULT_SERVICES } from '@/defaults'

export const serviceSlice = (set, get) => ({
  services: structuredClone(DEFAULT_SERVICES),

  addService: (svc) => {
    const id = Math.max(0, ...get().services.map(s => s.id)) + 1
    set(s => ({ services: [...s.services, { ...svc, id }] }))
    return id
  },

  updateService: (id, updates) => {
    set(s => ({ services: s.services.map(sv => sv.id === id ? { ...sv, ...updates } : sv) }))
  },

  deleteService: (id) => {
    set(s => ({ services: s.services.filter(sv => sv.id !== id) }))
  },

  importServices: (services) => {
    set({ services })
  },

  getSvc: (id) => get().services.find(s => s.id === id),
})
