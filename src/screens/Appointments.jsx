import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/SearchInput'
import { ExcelToolbar } from '@/components/ExcelToolbar'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'
import { useToast } from '@/components/ToastProvider'
import { Check, X, Clock, Ban, Phone, CalendarCheck } from 'lucide-react'

const STATUS_FILTERS = ['all', 'pending', 'confirmed', 'completed', 'cancelled', 'no-show']

export function Appointments() {
  const { appointments, services, therapists, approveAppointment, cancelAppointment, markNoShow, completeAppointment, importAppointments } = useBeautyBookStore()
  const t = useT()
  const { showChain } = useToast()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const getSvc = (id) => services.find(s => s.id === id)
  const getTherapist = (id) => therapists.find(th => th.id === id)

  const handleApprove = (appt) => {
    approveAppointment(appt.id)
    showChain([
      { text: `✅ ${t('appt.toastConfirmed', { name: appt.client })}`, type: 'success' },
      { text: `📊 ${t('appt.toastDashUpdated')}`, type: 'info' },
    ])
    import('canvas-confetti').then(m => m.default({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#BE185D', '#7C3AED', '#0D9488'] }))
  }

  const handleCancel = (appt) => {
    const reason = prompt(t('appt.cancelReason'))
    if (reason !== null) {
      cancelAppointment(appt.id, reason)
    }
  }

  const sendWA = (appt) => {
    const svc = getSvc(appt.svcId)
    const svcName = svc ? t(svc.nameKey) : ''
    const lines = [
      `Hi ${appt.client}!`,
      ``,
      `Appointment reminder at Bella Beauty Centre:`,
      `Date: ${appt.date}`,
      `Time: ${appt.time}`,
      `Service: ${svcName}`,
      ``,
      `See you soon!`,
    ]
    const msg = encodeURIComponent(lines.join('\n'))
    window.open(`https://wa.me/6${appt.phone.replace(/[^0-9]/g, '')}?text=${msg}`, '_blank')
  }

  const filtered = appointments.filter(a => {
    if (statusFilter !== 'all' && a.status !== statusFilter) return false
    if (!search) return true
    const svc = getSvc(a.svcId)
    const th = getTherapist(a.tid)
    const q = search.toLowerCase()
    return a.client.toLowerCase().includes(q) || (svc && t(svc.nameKey).toLowerCase().includes(q)) || (th && th.name.toLowerCase().includes(q))
  })

  const statusBadge = (status) => {
    const map = {
      confirmed: { cls: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/20', key: 'appt.confirmed' },
      pending: { cls: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/20', key: 'appt.pendingStatus' },
      cancelled: { cls: 'bg-red-500/15 text-red-700 dark:text-red-400 border-red-500/20', key: 'appt.cancelled' },
      'no-show': { cls: 'bg-gray-500/15 text-gray-700 dark:text-gray-400 border-gray-500/20', key: 'appt.noShowStatus' },
      completed: { cls: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/20', key: 'appt.completed' },
    }
    const s = map[status] || map.pending
    return <Badge className={s.cls}>{t(s.key)}</Badge>
  }

  const filterLabelKeys = { all: 'appt.all', pending: 'appt.filterPending', confirmed: 'appt.filterConfirmed', completed: 'appt.filterCompleted', cancelled: 'appt.filterCancelled', 'no-show': 'appt.filterNoShow' }

  const exportData = filtered.map(a => ({
    Client: a.client, Phone: a.phone, Service: getSvc(a.svcId) ? t(getSvc(a.svcId).nameKey) : '', Therapist: getTherapist(a.tid)?.name || '', Date: a.date, Time: a.time, Price: getSvc(a.svcId)?.price || 0, Status: a.status,
  }))

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h2 className="text-lg font-bold heading-font">{t('appt.title')}</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder={t('appt.search')} />
          <ExcelToolbar data={exportData} sheetName="Appointments" onImport={importAppointments} />
          <Badge variant="outline">{t('appt.count', { n: filtered.length })}</Badge>
        </div>
      </div>

      <div className="flex gap-1 mb-3 overflow-x-auto">
        {STATUS_FILTERS.map(sf => (
          <Button key={sf} variant={statusFilter === sf ? 'default' : 'outline'} size="sm" className="text-xs h-7" onClick={() => setStatusFilter(sf)}>
            {t(filterLabelKeys[sf])}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('appt.client')}</TableHead>
              <TableHead>{t('appt.service')}</TableHead>
              <TableHead>{t('appt.therapist')}</TableHead>
              <TableHead>{t('appt.date')}</TableHead>
              <TableHead>{t('appt.time')}</TableHead>
              <TableHead className="text-right">{t('appt.price')}</TableHead>
              <TableHead>{t('appt.status')}</TableHead>
              <TableHead className="text-right">{t('appt.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(appt => {
              const svc = getSvc(appt.svcId)
              const therapist = getTherapist(appt.tid)
              return (
                <TableRow key={appt.id}>
                  <TableCell>
                    <div className="font-medium">{appt.client}</div>
                    <div className="text-xs text-muted-foreground">{appt.phone}</div>
                  </TableCell>
                  <TableCell>{svc?.emoji} {svc ? t(svc.nameKey) : ''}</TableCell>
                  <TableCell>
                    <span style={{ color: therapist?.c }} className="font-semibold">{therapist?.name}</span>
                  </TableCell>
                  <TableCell className="text-xs tabular-nums">{appt.date}</TableCell>
                  <TableCell className="font-semibold tabular-nums">{appt.time}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-rose-600 dark:text-rose-400">RM {svc?.price}</TableCell>
                  <TableCell>{statusBadge(appt.status)}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end flex-wrap">
                      {appt.status === 'pending' && (
                        <Button size="sm" variant="outline" className="h-7 text-xs cursor-pointer gap-1" onClick={() => handleApprove(appt)}><Check size={12} /> {t('appt.confirm')}</Button>
                      )}
                      {appt.status === 'confirmed' && (
                        <>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-emerald-600 cursor-pointer gap-1" onClick={() => completeAppointment(appt.id)}><Check size={12} /> {t('appt.complete')}</Button>
                          <Button size="sm" variant="outline" className="h-7 text-xs text-gray-500 cursor-pointer gap-1" onClick={() => markNoShow(appt.id)}><Ban size={12} /> {t('appt.noShow')}</Button>
                        </>
                      )}
                      {(appt.status === 'pending' || appt.status === 'confirmed') && (
                        <Button size="sm" variant="outline" className="h-7 text-xs text-red-500 cursor-pointer gap-1" onClick={() => handleCancel(appt)}><X size={12} /> {t('appt.cancel')}</Button>
                      )}
                      <Button size="sm" variant="ghost" className="h-7 text-xs cursor-pointer gap-1" onClick={() => sendWA(appt)}><Phone size={12} /> {t('appt.remind')}</Button>
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
