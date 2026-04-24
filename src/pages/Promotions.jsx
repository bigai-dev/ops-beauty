import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { ExcelToolbar } from '@/components/ExcelToolbar'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'

export function Promotions() {
  const { promotions, services, addPromotion, deletePromotion, updatePromotion, importPromotions } = useBeautyBookStore()
  const t = useT()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ name: '', type: 'percentage', value: '', code: '', startDate: '', endDate: '', active: true })

  const today = new Date().toISOString().slice(0, 10)

  const handleAdd = () => {
    if (!form.name || !form.value || !form.code) return
    addPromotion({ ...form, value: parseFloat(form.value), nameKey: '', services: [], usageCount: 0, maxUses: null })
    setForm({ name: '', type: 'percentage', value: '', code: '', startDate: '', endDate: '', active: true })
    setShowAdd(false)
  }

  const exportData = promotions.map(p => ({
    Name: p.nameKey ? t(p.nameKey) : p.name, Code: p.code, Type: p.type, Value: p.value, Start: p.startDate, End: p.endDate, Usage: p.usageCount, Active: p.active,
  }))

  return (
    <div className="page-enter space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-bold heading-font">{t('promo.title')}</h2>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>+ {t('promo.addPromo')}</Button>
          <ExcelToolbar data={exportData} sheetName="Promotions" onImport={importPromotions} />
        </div>
      </div>

      {showAdd && (
        <Card>
          <CardContent className="p-4 flex items-end gap-3 flex-wrap">
            <div className="flex-1"><label className="text-xs font-medium">Name</label><Input value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} className="h-8" /></div>
            <div>
              <label className="text-xs font-medium">{t('promo.type')}</label>
              <select className="h-8 rounded-md border border-input bg-background px-2 text-sm" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="percentage">{t('promo.percentage')}</option>
                <option value="fixed">{t('promo.fixed')}</option>
              </select>
            </div>
            <div><label className="text-xs font-medium">{t('promo.value')}</label><Input type="number" value={form.value} onChange={e => setForm(f => ({ ...f, value: e.target.value }))} className="h-8 w-20" /></div>
            <div><label className="text-xs font-medium">{t('promo.code')}</label><Input value={form.code} onChange={e => setForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} className="h-8 w-32" /></div>
            <div><label className="text-xs font-medium">Start</label><Input type="date" value={form.startDate} onChange={e => setForm(f => ({ ...f, startDate: e.target.value }))} className="h-8 w-36" /></div>
            <div><label className="text-xs font-medium">End</label><Input type="date" value={form.endDate} onChange={e => setForm(f => ({ ...f, endDate: e.target.value }))} className="h-8 w-36" /></div>
            <Button size="sm" className="h-8" onClick={handleAdd}>{t('common.save')}</Button>
          </CardContent>
        </Card>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>{t('promo.code')}</TableHead>
              <TableHead>{t('promo.type')}</TableHead>
              <TableHead className="text-right">{t('promo.value')}</TableHead>
              <TableHead>{t('promo.period')}</TableHead>
              <TableHead className="text-center">{t('promo.usage')}</TableHead>
              <TableHead>{t('promo.status')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {promotions.map(p => {
              const isExpired = p.endDate < today
              const isActive = p.active && !isExpired
              const displayName = p.nameKey ? t(p.nameKey) : p.name
              return (
                <TableRow key={p.id}>
                  <TableCell className="font-medium">{displayName}</TableCell>
                  <TableCell><code className="bg-muted px-1.5 py-0.5 rounded text-xs font-mono">{p.code}</code></TableCell>
                  <TableCell className="text-xs">{p.type === 'percentage' ? t('promo.percentage') : t('promo.fixed')}</TableCell>
                  <TableCell className="text-right font-semibold tabular-nums">
                    {p.type === 'percentage' ? `${p.value}%` : `RM ${p.value}`}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums">{p.startDate} → {p.endDate}</TableCell>
                  <TableCell className="text-center tabular-nums">{p.usageCount}{p.maxUses ? `/${p.maxUses}` : ''}</TableCell>
                  <TableCell>
                    {isActive ? (
                      <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs">{t('promo.active')}</Badge>
                    ) : (
                      <Badge variant="secondary" className="text-xs">{t('promo.expired')}</Badge>
                    )}
                    {p.happyHour && <Badge variant="outline" className="ml-1 text-[10px]">🕐 {p.happyHour.start}-{p.happyHour.end}</Badge>}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex gap-1 justify-end">
                      <Button variant="ghost" size="sm" className="h-7 text-xs" onClick={() => updatePromotion(p.id, { active: !p.active })}>
                        {p.active ? '⏸' : '▶'}
                      </Button>
                      <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500" onClick={() => deletePromotion(p.id)}>
                        {t('common.delete')}
                      </Button>
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
