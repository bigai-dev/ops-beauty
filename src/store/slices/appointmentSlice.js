import { DEFAULT_APPOINTMENTS } from '@/defaults'
import { MEMBERSHIP_TIERS } from '@/defaults'

export const appointmentSlice = (set, get) => ({
  appointments: structuredClone(DEFAULT_APPOINTMENTS),

  addAppointment: (appt) => {
    const id = Math.max(0, ...get().appointments.map(a => a.id)) + 1
    const today = new Date().toISOString().slice(0, 10)
    set(s => ({ appointments: [...s.appointments, { ...appt, id, date: appt.date || today }] }))
    return id
  },

  approveAppointment: (id) => {
    set(s => ({ appointments: s.appointments.map(a => a.id === id ? { ...a, status: 'confirmed' } : a) }))
  },

  cancelAppointment: (id, reason = '') => {
    set(s => ({ appointments: s.appointments.map(a => a.id === id ? { ...a, status: 'cancelled', cancelReason: reason } : a) }))
  },

  markNoShow: (id) => {
    set(s => ({ appointments: s.appointments.map(a => a.id === id ? { ...a, status: 'no-show' } : a) }))
  },

  completeAppointment: (id) => {
    const state = get()
    const appt = state.appointments.find(a => a.id === id)
    if (!appt) return

    // Update appointment status
    set(s => ({ appointments: s.appointments.map(a => a.id === id ? { ...a, status: 'completed' } : a) }))

    // Update client metrics if clientId exists
    const clientId = appt.clientId
    if (clientId) {
      const svc = state.services.find(sv => sv.id === appt.svcId)
      const price = svc?.price || 0
      const client = state.clients.find(c => c.id === clientId)
      if (client) {
        const newTotalSpent = client.totalSpent + price
        const newTier = MEMBERSHIP_TIERS.slice().reverse().find(t => newTotalSpent >= t.minSpent)?.id || 'bronze'
        const tierMultiplier = MEMBERSHIP_TIERS.find(t => t.id === newTier)?.pointsMultiplier || 1
        const earnedPoints = Math.round(price * 0.1 * tierMultiplier)

        set(s => ({
          clients: s.clients.map(c => c.id === clientId ? {
            ...c,
            visits: c.visits + 1,
            totalSpent: newTotalSpent,
            points: (c.points || 0) + earnedPoints,
            tier: newTier,
            lastVisit: appt.date,
          } : c)
        }))

        // Auto-use package session if client has matching active package
        const today = new Date().toISOString().slice(0, 10)
        const activePkg = state.clientPackages.find(p =>
          p.clientId === clientId &&
          state.packageTemplates.find(t => t.id === p.templateId)?.svcId === appt.svcId &&
          p.usedSessions < p.totalSessions &&
          p.expiryDate >= today
        )
        if (activePkg) {
          set(s => ({
            clientPackages: s.clientPackages.map(p =>
              p.id === activePkg.id ? { ...p, usedSessions: p.usedSessions + 1 } : p
            )
          }))
        }
      }
    }
  },

  rescheduleAppointment: (id, newDate, newTime) => {
    set(s => ({
      appointments: s.appointments.map(a => a.id === id ? { ...a, date: newDate, time: newTime, originalDate: a.date, originalTime: a.time } : a)
    }))
  },

  deleteAppointment: (id) => {
    set(s => ({ appointments: s.appointments.filter(a => a.id !== id) }))
  },

  importAppointments: (appts) => {
    set({ appointments: appts })
  },

  getPendingCount: () => get().appointments.filter(a => a.status === 'pending').length,

  getTodayRevenue: () => {
    const today = new Date().toISOString().slice(0, 10)
    return get().appointments
      .filter(a => a.date === today && a.status !== 'cancelled' && a.status !== 'no-show')
      .reduce((s, a) => {
        const svc = get().services.find(sv => sv.id === a.svcId)
        return s + (svc ? svc.price : 0)
      }, 0)
  },

  getRevenueByDateRange: (from, to) => {
    return get().appointments
      .filter(a => a.date >= from && a.date <= to && a.status !== 'cancelled' && a.status !== 'no-show')
      .reduce((s, a) => {
        const svc = get().services.find(sv => sv.id === a.svcId)
        return s + (svc ? svc.price : 0)
      }, 0)
  },

  isTimeBooked: (tid, time, date) => {
    const today = date || new Date().toISOString().slice(0, 10)
    return get().appointments.some(a => a.tid === tid && a.time === time && a.date === today && a.status !== 'cancelled' && a.status !== 'no-show')
  },
})
