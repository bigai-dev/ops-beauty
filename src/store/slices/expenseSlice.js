import { DEFAULT_EXPENSES } from '@/defaults'

export const expenseSlice = (set, get) => ({
  expenses: structuredClone(DEFAULT_EXPENSES),

  addExpense: (expense) => {
    const id = Math.max(0, ...get().expenses.map(e => e.id)) + 1
    set(s => ({ expenses: [...s.expenses, { ...expense, id }] }))
    return id
  },

  updateExpense: (id, updates) => {
    set(s => ({ expenses: s.expenses.map(e => e.id === id ? { ...e, ...updates } : e) }))
  },

  deleteExpense: (id) => {
    set(s => ({ expenses: s.expenses.filter(e => e.id !== id) }))
  },

  importExpenses: (expenses) => {
    set({ expenses })
  },

  getExpensesByDateRange: (from, to) => {
    return get().expenses.filter(e => e.date >= from && e.date <= to)
  },

  getExpensesByCategory: () => {
    const map = {}
    get().expenses.forEach(e => {
      map[e.category] = (map[e.category] || 0) + e.amount
    })
    return map
  },

  getTotalExpenses: (month) => {
    if (!month) return get().expenses.reduce((s, e) => s + e.amount, 0)
    return get().expenses.filter(e => e.date.startsWith(month)).reduce((s, e) => s + e.amount, 0)
  },
})
