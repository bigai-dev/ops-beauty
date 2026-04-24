import { useState, useRef, useEffect, useCallback } from 'react'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, Area, AreaChart, Legend } from 'recharts'
import { KpiCard } from '@/components/KpiCard'
import { ChartCard } from '@/components/ChartCard'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'
import { useDarkMode } from '@/lib/hooks/use-dark-mode'
import { useChartTheme } from '@/lib/hooks/use-chart-theme'
import { generatePdf } from '@/lib/pdf'
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, ChevronRight } from 'lucide-react'

// Typing animation hook
function useTypewriter(text, speed = 18, enabled = false) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    if (!enabled) { setDisplayed(''); setDone(false); return }
    setDisplayed('')
    setDone(false)
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(interval); setDone(true) }
    }, speed)
    return () => clearInterval(interval)
  }, [text, speed, enabled])
  return { displayed, done }
}

export function Financial() {
  const { appointments, services, therapists, expenses, clients, inventory } = useBeautyBookStore()
  const t = useT()
  const { isDark } = useDarkMode()
  const theme = useChartTheme('beautybook', isDark)
  const reportRef = useRef(null)

  const currentMonth = new Date().toISOString().slice(0, 7)
  const [showAI, setShowAI] = useState(false)
  const [aiPhase, setAiPhase] = useState(0) // 0=idle, 1=analyzing, 2=done

  const monthAppts = appointments.filter(a => a.date?.startsWith(currentMonth) && a.status !== 'cancelled' && a.status !== 'no-show')
  const monthRevenue = monthAppts.reduce((s, a) => {
    const svc = services.find(sv => sv.id === a.svcId)
    return s + (svc?.price || 0)
  }, 0)
  const monthExpenses = expenses.filter(e => e.date.startsWith(currentMonth)).reduce((s, e) => s + e.amount, 0)
  const netProfit = monthRevenue - monthExpenses
  const profitMargin = monthRevenue > 0 ? Math.round((netProfit / monthRevenue) * 100) : 0

  // Revenue by service
  const svcRevMap = {}
  services.forEach(s => { svcRevMap[s.id] = { name: t(s.nameKey), rev: 0 } })
  monthAppts.forEach(a => {
    const svc = services.find(s => s.id === a.svcId)
    if (svc) svcRevMap[svc.id].rev += svc.price
  })
  const svcRevData = Object.values(svcRevMap).filter(s => s.rev > 0).sort((a, b) => b.rev - a.rev)

  // Revenue by therapist
  const thRevData = therapists.map(th => {
    const rev = monthAppts.filter(a => a.tid === th.id).reduce((s, a) => {
      const svc = services.find(sv => sv.id === a.svcId)
      return s + (svc?.price || 0)
    }, 0)
    return { name: th.name, rev, color: th.c }
  }).sort((a, b) => b.rev - a.rev)

  // Expense breakdown
  const expCatMap = {}
  expenses.filter(e => e.date.startsWith(currentMonth)).forEach(e => {
    const key = t(`exp.cat.${e.category}`)
    expCatMap[key] = (expCatMap[key] || 0) + e.amount
  })
  const expData = Object.entries(expCatMap).map(([name, value]) => ({ name, value })).sort((a, b) => b.value - a.value)

  const barColors = ['#EC4899', '#8B5CF6', '#0D9488', '#F59E0B', '#10B981', '#F472B6']
  const pieColors = ['#EC4899', '#8B5CF6', '#0D9488', '#F59E0B', '#6366F1', '#F472B6', '#6B7280']

  // Peak hours
  const hourCounts = {}
  monthAppts.forEach(a => {
    const hour = a.time?.split(':')[0]
    if (hour) hourCounts[hour] = (hourCounts[hour] || 0) + 1
  })
  const peakData = Object.entries(hourCounts).map(([hour, count]) => ({ hour: `${hour}:00`, count })).sort((a, b) => a.hour.localeCompare(b.hour))

  // ─── AI FORECAST DATA (mock but derived from real store data) ───
  const topService = svcRevData[0]?.name || 'Facial'
  const topTherapist = thRevData[0]?.name || 'Aini'
  const avgDailyRev = monthRevenue / Math.max(1, new Date().getDate())
  const projectedMonthly = Math.round(avgDailyRev * 30)
  const lowStockItems = inventory.filter(p => p.qty <= p.lowStock)
  const totalClients = clients.length
  const repeatClients = clients.filter(c => c.visits >= 3).length
  const repeatPct = totalClients > 0 ? Math.round((repeatClients / totalClients) * 100) : 0

  // Forecast chart — 6 months projection
  const forecastData = [
    { month: 'Jan', actual: Math.round(projectedMonthly * 0.78), forecast: null },
    { month: 'Feb', actual: Math.round(projectedMonthly * 0.85), forecast: null },
    { month: 'Mar', actual: Math.round(projectedMonthly * 0.92), forecast: null },
    { month: 'Apr', actual: monthRevenue, forecast: projectedMonthly },
    { month: 'May', actual: null, forecast: Math.round(projectedMonthly * 1.08) },
    { month: 'Jun', actual: null, forecast: Math.round(projectedMonthly * 1.15) },
    { month: 'Jul', actual: null, forecast: Math.round(projectedMonthly * 1.22) },
    { month: 'Aug', actual: null, forecast: Math.round(projectedMonthly * 1.18) },
  ]

  // AI insight paragraphs
  const aiInsights = [
    {
      icon: TrendingUp,
      color: '#10B981',
      title: t('lang') === 'bm' ? 'Unjuran Pendapatan' : t('lang') === 'cn' ? '收入预测' : 'Revenue Projection',
      text: `Based on ${monthAppts.length} appointments this month (RM ${monthRevenue.toLocaleString()} revenue), your projected monthly revenue is RM ${projectedMonthly.toLocaleString()}. At current growth rate of ~8% month-over-month, you're on track to hit RM ${Math.round(projectedMonthly * 1.22).toLocaleString()} by July.`,
    },
    {
      icon: Sparkles,
      color: '#8B5CF6',
      title: t('lang') === 'bm' ? 'Perkhidmatan Terbaik' : t('lang') === 'cn' ? '最佳服务' : 'Top Performer',
      text: `${topService} is your highest revenue service this month. ${topTherapist} leads in revenue among therapists. Consider promoting ${topService} packages — clients who buy packages spend 2.3x more over 6 months.`,
    },
    {
      icon: Lightbulb,
      color: '#F59E0B',
      title: t('lang') === 'bm' ? 'Peluang Pertumbuhan' : t('lang') === 'cn' ? '增长机会' : 'Growth Opportunities',
      text: `Your ${repeatPct}% repeat client rate is ${repeatPct >= 60 ? 'strong' : 'below the 65% industry benchmark'}. ${peakData.length > 0 ? `Peak hours are ${peakData.sort((a, b) => b.count - a.count)[0]?.hour} — consider a happy hour promo for off-peak slots to increase utilization.` : ''} Upselling add-on services during booking could increase average ticket by 15-20%.`,
    },
    {
      icon: AlertTriangle,
      color: '#EF4444',
      title: t('lang') === 'bm' ? 'Amaran' : t('lang') === 'cn' ? '风险预警' : 'Risk Alerts',
      text: `${lowStockItems.length > 0 ? `${lowStockItems.length} product(s) are running low — restock ${lowStockItems.map(p => t(p.nameKey)).join(', ')} to avoid service disruption.` : 'Inventory levels look healthy.'} ${profitMargin < 20 ? `Profit margin at ${profitMargin}% is tight — review your rent (${Math.round((expenses.find(e => e.category === 'rent')?.amount || 0) / monthRevenue * 100)}% of revenue) and consider renegotiating.` : `Profit margin at ${profitMargin}% is solid for the beauty industry.`}`,
    },
  ]

  // Simulate AI "thinking"
  const handleRunAI = useCallback(() => {
    setShowAI(true)
    setAiPhase(1)
    setTimeout(() => setAiPhase(2), 2800)
  }, [])

  const handleDownloadPdf = async () => {
    if (reportRef.current) await generatePdf(reportRef.current, `BeautyBook_PnL_${currentMonth}.pdf`)
  }

  return (
    <div className="page-enter space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold heading-font">{t('fin.title')}</h2>
        <div className="flex gap-2">
          <Button size="sm" className="cursor-pointer gap-1.5" onClick={handleRunAI} disabled={aiPhase === 1} style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', border: 'none' }}>
            <Sparkles size={14} className={aiPhase === 1 ? 'animate-spin' : ''} />
            AI Sales Forecast
          </Button>
          <Button variant="outline" size="sm" className="cursor-pointer" onClick={handleDownloadPdf}>{t('fin.downloadPdf')}</Button>
        </div>
      </div>

      <div ref={reportRef}>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KpiCard title={t('fin.revenue')} value={monthRevenue} prefix="RM " color="green" hero />
          <KpiCard title={t('fin.expenses')} value={monthExpenses} prefix="RM " color="red" />
          <KpiCard title={t('fin.netProfit')} value={netProfit} prefix="RM " color={netProfit >= 0 ? 'green' : 'red'} />
          <KpiCard title={t('fin.profitMargin')} value={profitMargin} suffix="%" color={profitMargin >= 20 ? 'green' : 'amber'} />
        </div>

        {/* ─── AI FORECAST SECTION ─── */}
        {showAI && (
          <div className="mb-6 space-y-5 animate-in fade-in slide-in-from-top-4 duration-500">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}>
                <Sparkles size={20} className="text-white" />
              </div>
              <h3 className="text-xl font-bold heading-font">AI Sales Forecast</h3>
              <Badge className="text-sm bg-purple-500/15 text-purple-700 dark:text-purple-300 px-2.5 py-0.5">Beta</Badge>
            </div>

            {/* Analyzing state */}
            {aiPhase === 1 && (
              <Card>
                <CardContent className="p-8">
                  <div className="flex items-center gap-4">
                    <div className="relative w-10 h-10">
                      <div className="absolute inset-0 rounded-full border-2 border-primary/30" />
                      <div className="absolute inset-0 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold">Analyzing your business data...</p>
                      <p className="text-base text-foreground/60 mt-1">
                        Reviewing {appointments.length} appointments, {clients.length} clients, {inventory.length} products, {expenses.length} expenses
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    <AnalyzingStep text="Calculating revenue trends" delay={0} />
                    <AnalyzingStep text="Analyzing client retention patterns" delay={600} />
                    <AnalyzingStep text="Forecasting next 4 months" delay={1200} />
                    <AnalyzingStep text="Generating growth recommendations" delay={1800} />
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Results */}
            {aiPhase === 2 && (
              <>
                {/* Forecast Chart */}
                <Card>
                  <CardContent className="p-6">
                    <h4 className="text-lg font-bold heading-font mb-5 flex items-center gap-2">
                      <TrendingUp size={20} className="text-emerald-500" />
                      Revenue Forecast (6-Month Outlook)
                    </h4>
                    <ResponsiveContainer width="100%" height={280}>
                      <AreaChart data={forecastData} margin={{ left: 10, right: 10, top: 5 }}>
                        <defs>
                          <linearGradient id="actualGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#10B981" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#10B981" stopOpacity={0} />
                          </linearGradient>
                          <linearGradient id="forecastGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.3} />
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                        <XAxis dataKey="month" tick={{ fill: theme.text, fontSize: 13 }} />
                        <YAxis tick={{ fill: theme.text, fontSize: 12 }} tickFormatter={v => `RM ${(v / 1000).toFixed(1)}k`} />
                        <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.grid}`, borderRadius: 12, fontSize: 14 }} formatter={v => v ? `RM ${v.toLocaleString()}` : '—'} />
                        <Area type="monotone" dataKey="actual" stroke="#10B981" strokeWidth={2.5} fill="url(#actualGrad)" name="Actual" dot={{ fill: '#10B981', r: 5 }} connectNulls={false} />
                        <Area type="monotone" dataKey="forecast" stroke="#8B5CF6" strokeWidth={2.5} strokeDasharray="6 3" fill="url(#forecastGrad)" name="Forecast" dot={{ fill: '#8B5CF6', r: 5, strokeDasharray: '0' }} connectNulls={false} />
                        <Legend wrapperStyle={{ fontSize: 13 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                {/* AI Insight Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {aiInsights.map((insight, i) => (
                    <AIInsightCard key={i} insight={insight} delay={i * 150} />
                  ))}
                </div>

                {/* AI Summary */}
                <Card className="border-primary/20">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'linear-gradient(135deg, #EC4899, #8B5CF6)' }}>
                        <Sparkles size={20} className="text-white" />
                      </div>
                      <div className="min-w-0">
                        <p className="text-lg font-bold mb-2">AI Summary</p>
                        <TypewriterText text={`Your salon is performing well with RM ${monthRevenue.toLocaleString()} revenue this month and a healthy ${repeatPct}% client return rate. Projected to reach RM ${Math.round(projectedMonthly * 1.22).toLocaleString()} monthly by July. Key action items: ${lowStockItems.length > 0 ? 'restock low inventory items, ' : ''}promote ${topService} packages for higher lifetime value, and consider off-peak promotions to maximize chair utilization. Overall outlook: positive growth trajectory.`} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </>
            )}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <ChartCard title={t('fin.revenueByService')}>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={svcRevData} layout="vertical" margin={{ left: 10, right: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} horizontal={false} />
                <XAxis type="number" tick={{ fill: theme.muted, fontSize: 12 }} tickFormatter={v => `RM ${v}`} />
                <YAxis type="category" dataKey="name" width={110} tick={{ fill: theme.text, fontSize: 11 }} />
                <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.grid}`, borderRadius: 12, fontSize: 13 }} formatter={v => `RM ${v}`} />
                <Bar dataKey="rev" radius={[0, 6, 6, 0]} animationDuration={800}>
                  {svcRevData.map((_, i) => <Cell key={i} fill={barColors[i % barColors.length]} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title={t('fin.expenseBreakdown')}>
            <ResponsiveContainer width="100%" height={220}>
              <PieChart>
                <Pie data={expData} cx="50%" cy="50%" innerRadius={50} outerRadius={80} paddingAngle={3} dataKey="value" animationDuration={800}>
                  {expData.map((_, i) => <Cell key={i} fill={pieColors[i % pieColors.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.grid}`, borderRadius: 12, fontSize: 13 }} formatter={v => `RM ${v}`} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-wrap justify-center gap-x-3 gap-y-1 mt-1">
              {expData.map((d, i) => (
                <span key={d.name} className="flex items-center gap-1 text-xs text-muted-foreground">
                  <span className="w-2 h-2 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                  {d.name} (RM {d.value.toLocaleString()})
                </span>
              ))}
            </div>
          </ChartCard>

          <ChartCard title={t('fin.revenueByTherapist')}>
            <div className="space-y-2">
              {thRevData.map(th => (
                <div key={th.name} className="flex items-center gap-3">
                  <span className="text-sm font-semibold w-16" style={{ color: th.color }}>{th.name}</span>
                  <div className="flex-1 h-6 bg-muted rounded-full overflow-hidden">
                    <div className="h-full rounded-full transition-all duration-700" style={{ width: `${monthRevenue > 0 ? (th.rev / monthRevenue) * 100 : 0}%`, background: th.color }} />
                  </div>
                  <span className="text-sm font-bold tabular-nums w-20 text-right">RM {th.rev}</span>
                </div>
              ))}
            </div>
          </ChartCard>

          <ChartCard title={t('fin.peakHours')}>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={peakData} margin={{ left: 0, right: 10 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.grid} />
                <XAxis dataKey="hour" tick={{ fill: theme.muted, fontSize: 11 }} />
                <YAxis tick={{ fill: theme.muted, fontSize: 11 }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: theme.bg, border: `1px solid ${theme.grid}`, borderRadius: 12, fontSize: 13 }} />
                <Bar dataKey="count" fill="#EC4899" radius={[4, 4, 0, 0]} animationDuration={800} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    </div>
  )
}

// ─── Sub-components ───

function AnalyzingStep({ text, delay }) {
  const [visible, setVisible] = useState(false)
  const [done, setDone] = useState(false)
  useEffect(() => {
    const t1 = setTimeout(() => setVisible(true), delay)
    const t2 = setTimeout(() => setDone(true), delay + 700)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [delay])
  if (!visible) return null
  return (
    <div className="flex items-center gap-3 text-base animate-in fade-in slide-in-from-left-2 duration-300">
      {done ? (
        <span className="w-6 h-6 rounded-full bg-emerald-500 flex items-center justify-center text-white text-xs">✓</span>
      ) : (
        <span className="w-6 h-6 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      )}
      <span className={done ? 'text-foreground/50' : 'text-foreground'}>{text}</span>
    </div>
  )
}

function AIInsightCard({ insight, delay }) {
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])
  if (!visible) return null
  const Icon = insight.icon
  return (
    <Card className="animate-in fade-in slide-in-from-bottom-3 duration-400">
      <CardContent className="p-6">
        <div className="flex items-center gap-2.5 mb-3">
          <Icon size={20} style={{ color: insight.color }} />
          <span className="text-lg font-bold heading-font">{insight.title}</span>
        </div>
        <p className="text-base leading-relaxed text-foreground/70">{insight.text}</p>
      </CardContent>
    </Card>
  )
}

function TypewriterText({ text }) {
  const [displayed, setDisplayed] = useState('')
  const [done, setDone] = useState(false)
  useEffect(() => {
    let i = 0
    const interval = setInterval(() => {
      i++
      setDisplayed(text.slice(0, i))
      if (i >= text.length) { clearInterval(interval); setDone(true) }
    }, 12)
    return () => clearInterval(interval)
  }, [text])
  return (
    <p className="text-base leading-relaxed text-foreground/70">
      {displayed}
      {!done && <span className="inline-block w-0.5 h-5 bg-primary ml-0.5 animate-pulse align-middle" />}
    </p>
  )
}
