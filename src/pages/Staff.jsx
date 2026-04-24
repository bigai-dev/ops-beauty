import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ExcelToolbar } from '@/components/ExcelToolbar'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'

export function Staff() {
  const { appointments, services, therapists, importTherapists } = useBeautyBookStore()
  const t = useT()

  const exportData = therapists.map(th => ({
    Name: th.name, Role: t(th.roleKey), Rating: th.rating,
  }))

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold heading-font">{t('staff.title')}</h2>
        <ExcelToolbar data={exportData} sheetName="Staff" onImport={importTherapists} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {therapists.map(th => {
          const myAppts = appointments.filter(a => a.tid === th.id)
          const revenue = myAppts.reduce((s, a) => {
            const svc = services.find(sv => sv.id === a.svcId)
            return s + (svc?.price || 0)
          }, 0)
          return (
            <Card key={th.id}>
              <CardContent className="p-5 text-center">
                <div className="w-14 h-14 rounded-full mx-auto mb-2 flex items-center justify-center font-bold text-lg" style={{ background: th.bg, color: th.c }}>{th.ini}</div>
                <h3 className="font-semibold" style={{ color: th.c }}>{th.name}</h3>
                <p className="text-xs text-muted-foreground">{t(th.roleKey)}</p>
                <Badge variant="outline" className="mt-1" style={{ borderColor: th.c + '33', color: th.c }}>⭐ {th.rating}</Badge>
                <div className="flex justify-center gap-6 mt-3 text-xs">
                  <div><div className="font-bold text-base">{myAppts.length}</div><div className="text-muted-foreground">{t('staff.todayAppts')}</div></div>
                  <div><div className="font-bold text-base text-rose-600 dark:text-rose-400">RM {revenue}</div><div className="text-muted-foreground">{t('staff.todayRevenue')}</div></div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
