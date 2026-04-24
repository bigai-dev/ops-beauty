import { DEFAULT_THERAPISTS } from '@/defaults'

export const therapistSlice = (set, get) => ({
  therapists: structuredClone(DEFAULT_THERAPISTS),

  addTherapist: (t) => {
    const id = Math.max(0, ...get().therapists.map(th => th.id)) + 1
    set(s => ({ therapists: [...s.therapists, { ...t, id }] }))
    return id
  },

  updateTherapist: (id, updates) => {
    set(s => ({ therapists: s.therapists.map(t => t.id === id ? { ...t, ...updates } : t) }))
  },

  deleteTherapist: (id) => {
    set(s => ({ therapists: s.therapists.filter(t => t.id !== id) }))
  },

  importTherapists: (therapists) => {
    set({ therapists })
  },

  getTherapist: (id) => get().therapists.find(t => t.id === id),
})
