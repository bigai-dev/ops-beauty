import { Card, CardContent } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'

export function Performance() {
  const { appointments, services, therapists } = useBeautyBookStore()
  const t = useT()

  const rankings = therapists.map(th => {
    const myAppts = appointments.filter(a => a.tid === th.id)
    const revenue = myAppts.reduce((s, a) => {
      const svc = services.find(sv => sv.id === a.svcId)
      return s + (svc?.price || 0)
    }, 0)
    return { ...th, appts: myAppts.length, revenue }
  }).sort((a, b) => b.revenue - a.revenue)

  const medals = ['🥇', '🥈', '🥉']

  return (
    <div className="animate-in fade-in duration-300">
      <h2 className="text-lg font-bold mb-4 heading-font">{t('perf.title')}</h2>

      <div className="flex justify-center items-end gap-4 mb-6">
        {[1, 0, 2].map(rank => {
          const item = rankings[rank]
          if (!item) return null
          const isFirst = rank === 0
          return (
            <div key={item.id} className="text-center">
              <div className="text-2xl mb-1">{medals[rank]}</div>
              <div className={`w-16 ${isFirst ? 'h-20' : 'h-14'} rounded-t-lg flex items-center justify-center font-bold text-lg`} style={{ background: item.bg, color: item.c }}>{item.ini}</div>
              <p className="text-sm font-semibold mt-1" style={{ color: item.c }}>{item.name}</p>
              <p className="text-xs font-bold text-rose-600 dark:text-rose-400">RM {item.revenue}</p>
            </div>
          )
        })}
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>{t('perf.therapist')}</TableHead>
                <TableHead>{t('perf.role')}</TableHead>
                <TableHead className="text-center">{t('perf.apptCount')}</TableHead>
                <TableHead className="text-right">{t('perf.revenue')}</TableHead>
                <TableHead className="text-right">{t('perf.commission')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rankings.map((item, i) => (
                <TableRow key={item.id}>
                  <TableCell className="font-bold">{medals[i] || i + 1}</TableCell>
                  <TableCell><span className="font-semibold" style={{ color: item.c }}>{item.name}</span></TableCell>
                  <TableCell className="text-muted-foreground">{t(item.roleKey)}</TableCell>
                  <TableCell className="text-center">{item.appts}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">RM {item.revenue}</TableCell>
                  <TableCell className="text-right tabular-nums text-emerald-600 dark:text-emerald-400">RM {(item.revenue * 0.1).toFixed(0)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
