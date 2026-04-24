import { DEFAULT_TREATMENT_NOTES } from '@/defaults'

export const treatmentSlice = (set, get) => ({
  treatmentNotes: structuredClone(DEFAULT_TREATMENT_NOTES),

  addTreatmentNote: (note) => {
    const id = Math.max(0, ...get().treatmentNotes.map(n => n.id)) + 1
    const today = new Date().toISOString().slice(0, 10)
    set(s => ({ treatmentNotes: [...s.treatmentNotes, { ...note, id, date: note.date || today }] }))
    return id
  },

  updateTreatmentNote: (id, updates) => {
    set(s => ({ treatmentNotes: s.treatmentNotes.map(n => n.id === id ? { ...n, ...updates } : n) }))
  },

  deleteTreatmentNote: (id) => {
    set(s => ({ treatmentNotes: s.treatmentNotes.filter(n => n.id !== id) }))
  },

  getClientTreatments: (clientId) => {
    return get().treatmentNotes.filter(n => n.clientId === clientId).sort((a, b) => b.date.localeCompare(a.date))
  },

  importTreatmentNotes: (notes) => { set({ treatmentNotes: notes }) },
})
