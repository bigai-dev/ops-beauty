import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { KpiCard } from '@/components/KpiCard'
import { ExcelToolbar } from '@/components/ExcelToolbar'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'
import { EXPENSE_CATEGORIES, PAYMENT_METHODS } from '@/defaults'

export function Expenses() {
  const { expenses, addExpense, deleteExpense, importExpenses, getExpensesByCategory } = useBeautyBookStore()
  const t = useT()
  const [showAdd, setShowAdd] = useState(false)
  const [form, setForm] = useState({ date: new Date().toISOString().slice(0, 10), category: 'misc', description: '', amount: '', method: 'cash' })

  const currentMonth = new Date().toISOString().slice(0, 7)
  const monthExpenses = expenses.filter(e => e.date.startsWith(currentMonth))
  const monthTotal = monthExpenses.reduce((s, e) => s + e.amount, 0)
  const catBreakdown = getExpensesByCategory()

  const handleAdd = () => {
    if (!form.amount) return
    addExpense({ ...form, amount: parseFloat(form.amount), descKey: '' })
    setForm({ date: new Date().toISOString().slice(0, 10), category: 'misc', description: '', amount: '', method: 'cash' })
    setShowAdd(false)
  }

  const exportData = expenses.map(e => ({
    Date: e.date, Category: t(`exp.cat.${e.category}`), Description: e.descKey ? t(e.descKey) : e.description, Amount: e.amount, Payment: t(`exp.method.${e.method}`),
  }))

  const sorted = [...expenses].sort((a, b) => b.date.localeCompare(a.date))

  const catColors = { rent: '#BE185D', utilities: '#7C3AED', products: '#0D9488', salary: '#B45309', marketing: '#DB2777', equipment: '#6366F1', misc: '#6B7280' }

  return (
    <div className="page-enter space-y-4">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <h2 className="text-lg font-bold heading-font">{t('exp.title')}</h2>
        <div className="flex items-center gap-3">
          <Button size="sm" onClick={() => setShowAdd(!showAdd)}>+ {t('exp.addExpense')}</Button>
          <ExcelToolbar data={exportData} sheetName="Expenses" onImport={importExpenses} />
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        <KpiCard title={`${t('exp.total')} (${t('exp.thisMonth')})`} value={monthTotal} prefix="RM " color="red" />
        {Object.entries(catBreakdown).slice(0, 3).map(([cat, amount]) => (
          <KpiCard key={cat} title={t(`exp.cat.${cat}`)} value={amount} prefix="RM " color="purple" />
        ))}
      </div>

      {showAdd && (
        <Card>
          <CardContent className="p-4 flex items-end gap-3 flex-wrap">
            <div><label className="text-xs font-medium">{t('exp.date')}</label><Input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} className="h-8 w-36" /></div>
            <div>
              <label className="text-xs font-medium">{t('exp.category')}</label>
              <select className="h-8 rounded-md border border-input bg-background px-2 text-sm" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                {EXPENSE_CATEGORIES.map(c => <option key={c} value={c}>{t(`exp.cat.${c}`)}</option>)}
              </select>
            </div>
            <div className="flex-1"><label className="text-xs font-medium">{t('exp.description')}</label><Input value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} className="h-8" /></div>
            <div><label className="text-xs font-medium">{t('exp.amount')}</label><Input type="number" value={form.amount} onChange={e => setForm(f => ({ ...f, amount: e.target.value }))} className="h-8 w-28" placeholder="RM" /></div>
            <div>
              <label className="text-xs font-medium">{t('exp.method')}</label>
              <select className="h-8 rounded-md border border-input bg-background px-2 text-sm" value={form.method} onChange={e => setForm(f => ({ ...f, method: e.target.value }))}>
                {PAYMENT_METHODS.map(m => <option key={m} value={m}>{t(`exp.method.${m}`)}</option>)}
              </select>
            </div>
            <Button size="sm" className="h-8" onClick={handleAdd}>{t('common.save')}</Button>
          </CardContent>
        </Card>
      )}

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('exp.date')}</TableHead>
              <TableHead>{t('exp.category')}</TableHead>
              <TableHead>{t('exp.description')}</TableHead>
              <TableHead className="text-right">{t('exp.amount')}</TableHead>
              <TableHead>{t('exp.method')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sorted.map(e => (
              <TableRow key={e.id}>
                <TableCell className="tabular-nums text-xs">{e.date}</TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs" style={{ borderColor: (catColors[e.category] || '#6B7280') + '44', color: catColors[e.category] || '#6B7280' }}>
                    {t(`exp.cat.${e.category}`)}
                  </Badge>
                </TableCell>
                <TableCell>{e.descKey ? t(e.descKey) : e.description}</TableCell>
                <TableCell className="text-right font-semibold tabular-nums text-red-600 dark:text-red-400">RM {e.amount.toLocaleString()}</TableCell>
                <TableCell className="text-xs">{t(`exp.method.${e.method}`)}</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-7 text-xs text-red-500" onClick={() => deleteExpense(e.id)}>{t('common.delete')}</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
