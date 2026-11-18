import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { KpiCard } from '@/components/KpiCard'
import { ChartCard } from '@/components/ChartCard'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'
import { useDarkMode } from '@/lib/hooks/use-dark-mode'
import { useChartTheme } from '@/lib/hooks/use-chart-theme'
import { exportToExcel } from '@/lib/excel'
import { DollarSign, CalendarCheck, UserX, UserCheck, Sparkles, Download } from 'lucide-react'

export function Dashboard() {
  const { appointments, services, therapists, getTodayRevenue, expenses, inventory } = useBeautyBookStore()
  const t = useT()
  const { isDark } = useDarkMode()
  const theme = useChartTheme('beautybook', isDark)
  const todayRevenue = getTodayRevenue()
  // Same "today" rule as getTodayRevenue, so the two cards agree
  const today = new Date().toISOString().slice(0, 10)
  const todayApptCount = appointments.filter(a => a.date === today && a.status !== 'cancelled' && a.status !== 'no-show').length

  const svcRevMap = {}
  services.forEach(s => { svcRevMap[s.id] = { name: s.emoji + ' ' + t(s.nameKey), rev: 0 } })
  appointments.forEach(a => {
    const svc = services.find(s => s.id === a.svcId)
    if (svc && svcRevMap[a.svcId]) svcRevMap[a.svcId].rev += svc.price
  })
  const svcRevData = Object.values(svcRevMap).filter(s => s.rev > 0).sort((a, b) => b.rev - a.rev)
  const barColors = ['#EC4899', '#8B5CF6', '#0D9488', '#F59E0B', '#10B981', '#F472B6']

  const statusData = [
    { name: t('dash.confirmed'), value: appointments.filter(a => a.status === 'confirmed').length, color: '#10B981' },
    { name: t('dash.pending'), value: appointments.filter(a => a.status === 'pending').length, color: '#F59E0B' },
  ].filter(d => d.value > 0)

  const handleExportAll = () => {
    exportToExcel([
      { name: 'Appointments', data: appointments },
      { name: 'Services', data: services.map(s => ({ ...s, name: t(s.nameKey) })) },
      { name: 'Therapists', data: therapists.map(th => ({ ...th, role: t(th.roleKey) })) },
      { name: 'Inventory', data: inventory.map(p => ({ ...p, name: t(p.nameKey) })) },
      { name: 'Expenses', data: expenses.map(e => ({ ...e, description: t(e.descKey) })) },
    ], 'beautybook_all_data.xlsx')
  }

  return (
    <div className="page-enter space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="demo-page-header text-foreground">{t('dash.title')}</h1>
          <p className="text-muted-foreground text-sm mt-1">{t('app.subtitle')} · {new Date().toLocaleDateString('en-MY', { month: 'long', day: 'numeric', weekday: 'long' })}</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="text-xs cursor-pointer gap-1.5" onClick={handleExportAll}>
            <Download size={13} /> {t('excel.exportAll')}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="stagger-item">
          <KpiCard title={t('dash.todayRevenue')} value={todayRevenue} prefix="RM " color="red" hero trend={12}
            icon={<DollarSign size={20} />}
          />
        </div>
        <div className="stagger-item">
          <KpiCard title={t('dash.todayAppts')} value={todayApptCount} suffix={` ${t('dash.appts')}`} color="purple" trend={8}
            icon={<CalendarCheck size={20} />}
          />
        </div>
        <div className="stagger-item">
          <KpiCard title={t('dash.noShowRate')} value={8} suffix="%" color="amber"
            icon={<UserX size={20} />}
          />
        </div>
        <div className="stagger-item">
          <KpiCard title={t('dash.returnRate')} value={72} suffix="%" color="green" trend={5}
            icon={<UserCheck size={20} />}
          />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <ChartCard title={t('dash.svcRevenue')} icon={<Sparkles size={15} />} className="lg:col-span-2 stagger-item">
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={svcRevData} layout="vertical" margin={{ left: 10, right: 20, top: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal={false} />
              <XAxis type="number" tick={{ fill: theme.muted, fontSize: 12 }} tickFormatter={v => `RM ${v}`} />
              <YAxis type="category" dataKey="name" width={100} tick={{ fill: theme.text, fontSize: 11 }} />
              <Tooltip {...theme.tooltip} formatter={v => `RM ${v}`} />
              <Bar dataKey="rev" name={t('fin.revenue')} radius={[0, 8, 8, 0]} animationDuration={800}>
                {svcRevData.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        <ChartCard title={t('dash.apptStatus')} className="lg:col-span-1 stagger-item">
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie data={statusData} stroke={theme.surface} cx="50%" cy="50%" innerRadius={45} outerRadius={70} paddingAngle={4} dataKey="value" animationDuration={800}>
                {statusData.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip {...theme.tooltip} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex flex-col items-center gap-1.5 -mt-1">
            {statusData.map(d => (
              <span key={d.name} className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: d.color }} />
                {d.name} ({d.value})
              </span>
            ))}
          </div>
        </ChartCard>

        <div className="lg:col-span-2 space-y-3 stagger-item">
          <h3 className="text-sm font-semibold heading-font text-muted-foreground">{t('dash.todayTherapists')}</h3>
          {therapists.map(th => {
            const myAppts = appointments.filter(a => a.tid === th.id)
            const revenue = myAppts.reduce((s, a) => {
              const svc = services.find(sv => sv.id === a.svcId)
              return s + (svc?.price || 0)
            }, 0)
            return (
              <Card key={th.id} className="card-hover cursor-pointer">
                <CardContent className="p-3.5 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 transition-transform duration-200 hover:scale-105" style={{ background: th.bg, color: th.c, boxShadow: `0 4px 12px ${th.c}22` }}>{th.ini}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold" style={{ color: th.c }}>{th.name}</p>
                    <p className="text-xs text-muted-foreground">{t(th.roleKey)}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold tabular-nums heading-font">RM {revenue}</p>
                    <p className="text-xs text-muted-foreground">{myAppts.length} {t('dash.appts')}</p>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>
    </div>
  )
}
