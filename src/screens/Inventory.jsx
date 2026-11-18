import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/SearchInput'
import { ExcelToolbar } from '@/components/ExcelToolbar'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'
import { INVENTORY_CATEGORIES } from '@/defaults'

export function Inventory() {
  const { inventory, adjustStock, importInventory } = useBeautyBookStore()
  const t = useT()
  const [search, setSearch] = useState('')
  const [catFilter, setCatFilter] = useState('all')

  const filtered = inventory.filter(p => {
    if (catFilter !== 'all' && p.category !== catFilter) return false
    if (!search) return true
    return t(p.nameKey).toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase())
  })

  const exportData = inventory.map(p => ({
    SKU: p.sku, Name: t(p.nameKey), Category: t(`inv.cat.${p.category}`), Qty: p.qty, CostPrice: p.costPrice, SellPrice: p.sellPrice, LowStockThreshold: p.lowStock, Supplier: p.supplier,
  }))

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h2 className="text-lg font-bold heading-font">{t('inv.title')}</h2>
        <div className="flex items-center gap-3 flex-wrap">
          <SearchInput value={search} onChange={setSearch} placeholder={t('inv.search')} />
          <ExcelToolbar data={exportData} sheetName="Inventory" onImport={importInventory} />
        </div>
      </div>

      <div className="flex gap-1 mb-3 overflow-x-auto">
        <Button variant={catFilter === 'all' ? 'default' : 'outline'} size="sm" className="text-xs h-7" onClick={() => setCatFilter('all')}>
          {t('inv.allCategories')}
        </Button>
        {INVENTORY_CATEGORIES.map(cat => (
          <Button key={cat} variant={catFilter === cat ? 'default' : 'outline'} size="sm" className="text-xs h-7" onClick={() => setCatFilter(cat)}>
            {t(`inv.cat.${cat}`)}
          </Button>
        ))}
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('inv.product')}</TableHead>
              <TableHead>{t('inv.category')}</TableHead>
              <TableHead className="text-center">{t('inv.qty')}</TableHead>
              <TableHead className="text-right">{t('inv.costPrice')}</TableHead>
              <TableHead className="text-right">{t('inv.sellPrice')}</TableHead>
              <TableHead>{t('inv.supplier')}</TableHead>
              <TableHead className="text-center">{t('inv.adjust')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(p => (
              <TableRow key={p.id}>
                <TableCell>
                  <div className="font-medium">{t(p.nameKey)}</div>
                  <div className="text-xs text-muted-foreground">{p.sku}</div>
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className="text-xs">{t(`inv.cat.${p.category}`)}</Badge>
                </TableCell>
                <TableCell className="text-center">
                  <span className={`font-bold tabular-nums ${p.qty <= p.lowStock ? 'text-red-600' : ''}`}>{p.qty}</span>
                  {p.qty <= p.lowStock && (
                    <Badge variant="destructive" className="ml-1.5 text-[10px]">{t('inv.lowStock')}</Badge>
                  )}
                </TableCell>
                <TableCell className="text-right tabular-nums">RM {p.costPrice}</TableCell>
                <TableCell className="text-right tabular-nums text-rose-600 dark:text-rose-400 font-semibold">
                  {p.sellPrice > 0 ? `RM ${p.sellPrice}` : '—'}
                </TableCell>
                <TableCell className="text-xs text-muted-foreground">{p.supplier}</TableCell>
                <TableCell className="text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-xs" onClick={() => adjustStock(p.id, -1)} disabled={p.qty <= 0}>−</Button>
                    <Button variant="outline" size="sm" className="h-7 w-7 p-0 text-xs" onClick={() => adjustStock(p.id, 1)}>+</Button>
                    <Button variant="outline" size="sm" className="h-7 text-xs ml-1" onClick={() => adjustStock(p.id, 10)}>+10</Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
