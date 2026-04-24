import { Card, CardContent } from '@/components/ui/card'
import { ExcelToolbar } from '@/components/ExcelToolbar'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'

export function Services() {
  const { services, importServices } = useBeautyBookStore()
  const t = useT()

  const exportData = services.map(s => ({
    Name: t(s.nameKey), Duration: s.dur, Price: s.price, Description: t(s.descKey), Emoji: s.emoji,
  }))

  return (
    <div className="animate-in fade-in duration-300">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold heading-font">{t('svc.title')}</h2>
        <ExcelToolbar data={exportData} sheetName="Services" onImport={importServices} />
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {services.map(svc => (
          <Card key={svc.id}>
            <CardContent className="p-4 text-center">
              <div className="text-3xl mb-2">{svc.emoji}</div>
              <h3 className="font-semibold text-sm heading-font">{t(svc.nameKey)}</h3>
              <p className="text-xs text-muted-foreground mt-0.5">⏱ {t('svc.minutes', { n: svc.dur })} · {t(svc.descKey)}</p>
              <p className="text-sm font-bold text-rose-600 dark:text-rose-400 mt-2">RM {svc.price}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
