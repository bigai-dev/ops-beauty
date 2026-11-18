import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { appointmentSlice } from './slices/appointmentSlice'
import { clientSlice } from './slices/clientSlice'
import { serviceSlice } from './slices/serviceSlice'
import { therapistSlice } from './slices/therapistSlice'
import { inventorySlice } from './slices/inventorySlice'
import { expenseSlice } from './slices/expenseSlice'
import { packageSlice } from './slices/packageSlice'
import { treatmentSlice } from './slices/treatmentSlice'
import { promotionSlice } from './slices/promotionSlice'

import {
  DEFAULT_APPOINTMENTS, DEFAULT_CLIENTS, DEFAULT_SERVICES, DEFAULT_THERAPISTS,
  DEFAULT_INVENTORY, DEFAULT_EXPENSES, DEFAULT_PACKAGE_TEMPLATES, DEFAULT_CLIENT_PACKAGES,
  DEFAULT_TREATMENT_NOTES, DEFAULT_PROMOTIONS,
} from '@/defaults'

export const useBeautyBookStore = create(
  persist(
    (...a) => ({
      ...appointmentSlice(...a),
      ...clientSlice(...a),
      ...serviceSlice(...a),
      ...therapistSlice(...a),
      ...inventorySlice(...a),
      ...expenseSlice(...a),
      ...packageSlice(...a),
      ...treatmentSlice(...a),
      ...promotionSlice(...a),

      getNotifications: () => {
        const state = a[1]()
        const notifs = []
        const pending = state.appointments.filter(ap => ap.status === 'pending').length
        if (pending > 0) notifs.push({ text: `📋 ${pending} pending`, key: 'pending' })
        const lowStock = state.inventory.filter(p => p.qty <= p.lowStock).length
        if (lowStock > 0) notifs.push({ text: `📦 ${lowStock} low stock`, key: 'lowstock' })
        return notifs
      },

      resetAll: () => {
        const set = a[0]
        set({
          appointments: structuredClone(DEFAULT_APPOINTMENTS),
          clients: structuredClone(DEFAULT_CLIENTS),
          services: structuredClone(DEFAULT_SERVICES),
          therapists: structuredClone(DEFAULT_THERAPISTS),
          inventory: structuredClone(DEFAULT_INVENTORY),
          expenses: structuredClone(DEFAULT_EXPENSES),
          packageTemplates: structuredClone(DEFAULT_PACKAGE_TEMPLATES),
          clientPackages: structuredClone(DEFAULT_CLIENT_PACKAGES),
          treatmentNotes: structuredClone(DEFAULT_TREATMENT_NOTES),
          promotions: structuredClone(DEFAULT_PROMOTIONS),
        })
      },
    }),
    {
      name: 'beautybook_store_v2',
      // v4: demo dates follow the real date, with a month of visits and bills. Saved data from older versions
      // (frozen in April 2026) is dropped once and replaced by the fresh seed.
      version: 4,
      migrate: () => ({}),
    }
  )
)
