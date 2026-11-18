// Default seed data — used to initialize the store on first load or reset.
// All translatable fields use keys (nameKey, roleKey, etc.) resolved via i18n t().

// ── Demo dates ─────────────────────────────────────────────────────────────
// The seed is written as if "today" were SEED_TODAY. When the store is created
// (first load or "Reset data"), every date is moved so SEED_TODAY lands on the
// real current date, so "today" and "this month" screens always look busy.
// "Today" matches the screens: new Date().toISOString().slice(0, 10).
const SEED_TODAY = '2026-04-06'
const DAY_MS = 86400000
const isoToday = () => new Date().toISOString().slice(0, 10)
const toUTC = (iso) => Date.UTC(+iso.slice(0, 4), +iso.slice(5, 7) - 1, +iso.slice(8, 10))
const SHIFT_DAYS = Math.round((toUTC(isoToday()) - toUTC(SEED_TODAY)) / DAY_MS)

// Same distance from today as in the seed (appointments, notes, visits, packages)
export const seedDate = (iso) => new Date(toUTC(iso) + SHIFT_DAYS * DAY_MS).toISOString().slice(0, 10)

// Monthly bills keep their day of the month in the current month, never later than today
const thisMonthOn = (iso) => {
  const today = isoToday()
  const date = `${today.slice(0, 7)}-${iso.slice(8, 10)}`
  return date > today ? today : date
}

// Calendar-year promotions run for the current year
const thisYearOn = (iso) => `${isoToday().slice(0, 4)}${iso.slice(4)}`

export const DEFAULT_SERVICES = [
  { id: 1, nameKey: 'svc.facial', dur: 60, price: 120, emoji: '✨', descKey: 'svc.facial.desc' },
  { id: 2, nameKey: 'svc.massage', dur: 90, price: 180, emoji: '💆', descKey: 'svc.massage.desc' },
  { id: 3, nameKey: 'svc.nails', dur: 45, price: 80, emoji: '💅', descKey: 'svc.nails.desc' },
  { id: 4, nameKey: 'svc.brows', dur: 30, price: 60, emoji: '🎨', descKey: 'svc.brows.desc' },
  { id: 5, nameKey: 'svc.lashes', dur: 120, price: 200, emoji: '👁️', descKey: 'svc.lashes.desc' },
  { id: 6, nameKey: 'svc.whitening', dur: 75, price: 150, emoji: '🌸', descKey: 'svc.whitening.desc' },
]

export const DEFAULT_THERAPISTS = [
  { id: 1, name: 'Aini', roleKey: 'role.skincare', ini: 'A', c: '#BE185D', bg: 'rgba(190,24,93,0.12)', rating: '4.9' },
  { id: 2, name: 'Siti', roleKey: 'role.massage', ini: 'S', c: '#7C3AED', bg: 'rgba(124,58,237,0.12)', rating: '4.8' },
  { id: 3, name: 'Mei', roleKey: 'role.nails', ini: 'M', c: '#0D9488', bg: 'rgba(13,148,136,0.12)', rating: '4.9' },
]

export const DEFAULT_APPOINTMENTS = [
  // The 5 days before today — completed appointments (historical revenue)
  { id: 1, client: 'Nurul Ain', clientId: 1, phone: '0112345678', svcId: 1, tid: 1, time: '10:00', date: seedDate('2026-04-01'), status: 'completed' },
  { id: 2, client: 'Sarah Lim', clientId: 3, phone: '0167890123', svcId: 2, tid: 2, time: '11:00', date: seedDate('2026-04-01'), status: 'completed' },
  { id: 3, client: 'Amy Chan', clientId: 7, phone: '0156789012', svcId: 1, tid: 1, time: '14:00', date: seedDate('2026-04-01'), status: 'completed' },
  { id: 4, client: 'Priya K.', clientId: 2, phone: '0198765432', svcId: 3, tid: 3, time: '10:00', date: seedDate('2026-04-02'), status: 'completed' },
  { id: 5, client: 'Lina Tan', clientId: 5, phone: '0123456789', svcId: 4, tid: 1, time: '09:30', date: seedDate('2026-04-02'), status: 'completed' },
  { id: 6, client: 'Michelle W.', clientId: 6, phone: '0189012345', svcId: 5, tid: 2, time: '14:00', date: seedDate('2026-04-02'), status: 'completed' },
  { id: 7, client: 'Hafizah', clientId: 4, phone: '0134567890', svcId: 6, tid: 3, time: '15:00', date: seedDate('2026-04-02'), status: 'completed' },
  { id: 8, client: 'Nurul Ain', clientId: 1, phone: '0112345678', svcId: 1, tid: 1, time: '10:00', date: seedDate('2026-04-03'), status: 'completed' },
  { id: 9, client: 'Sarah Lim', clientId: 3, phone: '0167890123', svcId: 2, tid: 2, time: '11:00', date: seedDate('2026-04-03'), status: 'completed' },
  { id: 10, client: 'Priya K.', clientId: 2, phone: '0198765432', svcId: 3, tid: 3, time: '14:30', date: seedDate('2026-04-03'), status: 'completed' },
  { id: 11, client: 'Amy Chan', clientId: 7, phone: '0156789012', svcId: 6, tid: 1, time: '15:00', date: seedDate('2026-04-03'), status: 'completed' },
  { id: 12, client: 'Lina Tan', clientId: 5, phone: '0123456789', svcId: 4, tid: 3, time: '09:30', date: seedDate('2026-04-04'), status: 'completed' },
  { id: 13, client: 'Michelle W.', clientId: 6, phone: '0189012345', svcId: 5, tid: 2, time: '10:00', date: seedDate('2026-04-04'), status: 'completed' },
  { id: 14, client: 'Hafizah', clientId: 4, phone: '0134567890', svcId: 1, tid: 1, time: '11:00', date: seedDate('2026-04-04'), status: 'completed' },
  { id: 15, client: 'Nurul Ain', clientId: 1, phone: '0112345678', svcId: 2, tid: 2, time: '14:00', date: seedDate('2026-04-04'), status: 'completed' },
  { id: 16, client: 'Sarah Lim', clientId: 3, phone: '0167890123', svcId: 2, tid: 2, time: '10:00', date: seedDate('2026-04-05'), status: 'completed' },
  { id: 17, client: 'Amy Chan', clientId: 7, phone: '0156789012', svcId: 1, tid: 1, time: '11:00', date: seedDate('2026-04-05'), status: 'completed' },
  { id: 18, client: 'Priya K.', clientId: 2, phone: '0198765432', svcId: 3, tid: 3, time: '14:00', date: seedDate('2026-04-05'), status: 'completed' },
  { id: 19, client: 'Lina Tan', clientId: 5, phone: '0123456789', svcId: 5, tid: 2, time: '15:00', date: seedDate('2026-04-05'), status: 'completed' },
  // Today — first two done, the rest still to come
  { id: 20, client: 'Nurul Ain', clientId: 1, phone: '0112345678', svcId: 1, tid: 1, time: '09:30', date: seedDate('2026-04-06'), status: 'completed' },
  { id: 21, client: 'Priya K.', clientId: 2, phone: '0198765432', svcId: 3, tid: 3, time: '10:00', date: seedDate('2026-04-06'), status: 'completed' },
  { id: 22, client: 'Sarah Lim', clientId: 3, phone: '0167890123', svcId: 2, tid: 2, time: '11:00', date: seedDate('2026-04-06'), status: 'confirmed' },
  { id: 23, client: 'Hafizah', clientId: 4, phone: '0134567890', svcId: 6, tid: 3, time: '14:30', date: seedDate('2026-04-06'), status: 'pending' },
  { id: 24, client: 'Lina Tan', clientId: 5, phone: '0123456789', svcId: 4, tid: 1, time: '14:00', date: seedDate('2026-04-06'), status: 'confirmed' },
  { id: 25, client: 'Michelle W.', clientId: 6, phone: '0189012345', svcId: 5, tid: 2, time: '14:30', date: seedDate('2026-04-06'), status: 'pending' },
  { id: 26, client: 'Amy Chan', clientId: 7, phone: '0156789012', svcId: 1, tid: 1, time: '15:30', date: seedDate('2026-04-06'), status: 'confirmed' },
]

export const DEFAULT_CLIENTS = [
  { id: 1, name: 'Nurul Ain', phone: '0112345678', visits: 12, totalSpent: 1440, prefKey: 'client.pref.afternoon', allergyKey: 'client.allergy.alcohol', lastVisit: seedDate('2026-03-24'), favSvcId: 1, points: 144, tier: 'bronze' },
  { id: 2, name: 'Priya K.', phone: '0198765432', visits: 8, totalSpent: 640, prefKey: 'client.pref.mei', allergyKey: '', lastVisit: seedDate('2026-03-24'), favSvcId: 3, points: 64, tier: 'bronze' },
  { id: 3, name: 'Sarah Lim', phone: '0167890123', visits: 15, totalSpent: 2700, prefKey: 'client.pref.weekly', allergyKey: 'client.allergy.oil', lastVisit: seedDate('2026-03-24'), favSvcId: 2, points: 270, tier: 'silver' },
  { id: 4, name: 'Hafizah', phone: '0134567890', visits: 5, totalSpent: 750, prefKey: 'client.pref.whitening', allergyKey: '', lastVisit: seedDate('2026-03-20'), favSvcId: 6, points: 75, tier: 'bronze' },
  { id: 5, name: 'Lina Tan', phone: '0123456789', visits: 20, totalSpent: 1200, prefKey: 'client.pref.brows', allergyKey: '', lastVisit: seedDate('2026-03-24'), favSvcId: 4, points: 120, tier: 'bronze' },
  { id: 6, name: 'Michelle W.', phone: '0189012345', visits: 3, totalSpent: 600, prefKey: 'client.pref.firstlash', allergyKey: 'client.allergy.glue', lastVisit: seedDate('2026-03-24'), favSvcId: 5, points: 60, tier: 'bronze' },
  { id: 7, name: 'Amy Chan', phone: '0156789012', visits: 10, totalSpent: 1200, prefKey: 'client.pref.vip', allergyKey: '', lastVisit: seedDate('2026-03-24'), favSvcId: 1, points: 120, tier: 'bronze' },
]

export const DEFAULT_INVENTORY = [
  { id: 1, nameKey: 'inv.haSerum', category: 'skincare', qty: 25, costPrice: 45, sellPrice: 120, lowStock: 5, supplier: 'Beauty Supply Co', sku: 'SKU-001' },
  { id: 2, nameKey: 'inv.cleanser', category: 'skincare', qty: 18, costPrice: 30, sellPrice: 85, lowStock: 5, supplier: 'Beauty Supply Co', sku: 'SKU-002' },
  { id: 3, nameKey: 'inv.massageOil', category: 'bodycare', qty: 12, costPrice: 55, sellPrice: 0, lowStock: 3, supplier: 'Aroma Trading', sku: 'SKU-003' },
  { id: 4, nameKey: 'inv.gelPolish', category: 'nails', qty: 40, costPrice: 15, sellPrice: 0, lowStock: 10, supplier: 'Nail World MY', sku: 'SKU-004' },
  { id: 5, nameKey: 'inv.faceMask', category: 'skincare', qty: 3, costPrice: 25, sellPrice: 75, lowStock: 5, supplier: 'Beauty Supply Co', sku: 'SKU-005' },
  { id: 6, nameKey: 'inv.lashGlue', category: 'lashes', qty: 8, costPrice: 35, sellPrice: 0, lowStock: 3, supplier: 'Lash Pro MY', sku: 'SKU-006' },
  { id: 7, nameKey: 'inv.whiteningCream', category: 'skincare', qty: 15, costPrice: 60, sellPrice: 180, lowStock: 5, supplier: 'Beauty Supply Co', sku: 'SKU-007' },
  { id: 8, nameKey: 'inv.browPencil', category: 'tools', qty: 20, costPrice: 12, sellPrice: 45, lowStock: 5, supplier: 'Cosmetic Hub', sku: 'SKU-008' },
]

export const DEFAULT_EXPENSES = [
  { id: 1, date: thisMonthOn('2026-04-01'), category: 'rent', descKey: 'exp.monthlyRent', amount: 1800, method: 'bank' },
  { id: 2, date: thisMonthOn('2026-04-01'), category: 'utilities', descKey: 'exp.electric', amount: 220, method: 'bank' },
  { id: 3, date: thisMonthOn('2026-04-02'), category: 'products', descKey: 'exp.restock', amount: 480, method: 'bank' },
  { id: 4, date: thisMonthOn('2026-04-03'), category: 'salary', descKey: 'exp.staffSalary', amount: 1200, method: 'bank' },
  { id: 5, date: thisMonthOn('2026-04-04'), category: 'marketing', descKey: 'exp.igAds', amount: 150, method: 'ewallet' },
  { id: 6, date: thisMonthOn('2026-04-05'), category: 'misc', descKey: 'exp.cleaning', amount: 80, method: 'cash' },
]

export const DEFAULT_PACKAGE_TEMPLATES = [
  { id: 1, nameKey: 'pkg.10facial', svcId: 1, sessions: 10, price: 1000, validDays: 365, active: true },
  { id: 2, nameKey: 'pkg.5massage', svcId: 2, sessions: 5, price: 800, validDays: 180, active: true },
  { id: 3, nameKey: 'pkg.10nails', svcId: 3, sessions: 10, price: 700, validDays: 365, active: true },
]

export const DEFAULT_CLIENT_PACKAGES = [
  { id: 1, clientId: 3, templateId: 2, purchaseDate: seedDate('2026-02-10'), expiryDate: seedDate('2026-08-10'), totalSessions: 5, usedSessions: 2, amountPaid: 800 },
  { id: 2, clientId: 7, templateId: 1, purchaseDate: seedDate('2026-01-15'), expiryDate: seedDate('2027-01-15'), totalSessions: 10, usedSessions: 4, amountPaid: 1000 },
]

export const DEFAULT_TREATMENT_NOTES = [
  { id: 1, clientId: 1, appointmentId: 1, date: seedDate('2026-04-06'), notes: 'Skin slightly dry, used extra hydrating mask. Client reported improvement from last session.', concerns: ['dryness', 'sensitivity'], productsUsed: ['Hyaluronic Acid Serum', 'Face Mask'], recommendations: 'Return in 2 weeks for follow-up hydration treatment.' },
  { id: 2, clientId: 3, appointmentId: 3, date: seedDate('2026-04-06'), notes: 'Full body massage focusing on shoulders and lower back. Client has desk job tension.', concerns: ['muscle tension', 'stress'], productsUsed: ['Massage Oil'], recommendations: 'Weekly sessions recommended. Try hot stone next time.' },
]

export const DEFAULT_PROMOTIONS = [
  // Hari Raya promo keeps the real 2026 Raya dates (a calendar fact, shown as expired after April)
  { id: 1, nameKey: 'promo.rpiHariRaya', type: 'percentage', value: 15, code: 'RAYA2026', services: [], startDate: '2026-03-20', endDate: '2026-04-20', active: true, usageCount: 12, maxUses: null },
  { id: 2, nameKey: 'promo.newClient', type: 'fixed', value: 20, code: 'WELCOME20', services: [], startDate: thisYearOn('2026-01-01'), endDate: thisYearOn('2026-12-31'), active: true, usageCount: 35, maxUses: null },
  { id: 3, nameKey: 'promo.lunchSpecial', type: 'percentage', value: 10, code: 'LUNCH10', services: [1, 2, 6], startDate: seedDate('2026-04-01'), endDate: seedDate('2026-06-30'), happyHour: { start: '12:00', end: '14:00' }, active: true, usageCount: 8, maxUses: 100 },
]

export const MEMBERSHIP_TIERS = [
  { id: 'bronze', minSpent: 0, pointsMultiplier: 1, discount: 0 },
  { id: 'silver', minSpent: 2000, pointsMultiplier: 1.5, discount: 5 },
  { id: 'gold', minSpent: 5000, pointsMultiplier: 2, discount: 10 },
]

export const TIME_SLOTS = ['09:00', '09:30', '10:00', '10:30', '11:00', '11:30', '12:00', '12:30', '14:00', '14:30', '15:00', '15:30', '16:00', '16:30', '17:00', '17:30', '18:00', '18:30']

export const EXPENSE_CATEGORIES = ['rent', 'utilities', 'products', 'salary', 'marketing', 'equipment', 'misc']
export const INVENTORY_CATEGORIES = ['skincare', 'bodycare', 'nails', 'lashes', 'tools', 'consumables']
export const PAYMENT_METHODS = ['cash', 'bank', 'ewallet']
