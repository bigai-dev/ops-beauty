import { useState } from 'react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/SearchInput'
import { ExcelToolbar } from '@/components/ExcelToolbar'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'
import { Eye } from 'lucide-react'

const TIER_COLORS = { bronze: '#B45309', silver: '#6B7280', gold: '#D97706' }

export function Clients({ onViewClient }) {
  const { clients, services, importClients } = useBeautyBookStore()
  const t = useT()
  const [search, setSearch] = useState('')

  const filtered = clients.filter(c => {
    if (!search) return true
    const q = search.toLowerCase()
    return c.name.toLowerCase().includes(q) || c.phone.includes(q)
  })

  const exportData = clients.map(c => ({
    Name: c.name, Phone: c.phone, Visits: c.visits, TotalSpent: c.totalSpent, Points: c.points, Tier: c.tier, LastVisit: c.lastVisit,
  }))

  return (
    <div className="page-enter">
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        <h2 className="text-lg font-bold heading-font">{t('client.title')}</h2>
        <div className="flex items-center gap-3">
          <SearchInput value={search} onChange={setSearch} placeholder={t('client.search')} />
          <ExcelToolbar data={exportData} sheetName="Clients" onImport={importClients} />
          <Badge variant="outline">{filtered.length} {t('nav.clients').toLowerCase()}</Badge>
        </div>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t('appt.client')}</TableHead>
              <TableHead>{t('client.tier')}</TableHead>
              <TableHead className="text-center">{t('client.visits', { n: '' }).trim()}</TableHead>
              <TableHead>{t('client.favService')}</TableHead>
              <TableHead className="text-right">{t('client.totalSpent')}</TableHead>
              <TableHead className="text-right">{t('client.points')}</TableHead>
              <TableHead>{t('client.lastVisit')}</TableHead>
              <TableHead>{t('client.allergy')}</TableHead>
              <TableHead className="text-right">{t('common.actions')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.map(client => {
              const favSvc = services.find(s => s.id === client.favSvcId)
              return (
                <TableRow key={client.id} className="cursor-pointer hover:bg-accent/50" onClick={() => onViewClient?.(client.id)}>
                  <TableCell>
                    <div className="font-semibold">{client.name}</div>
                    <div className="text-xs text-muted-foreground">{client.phone}</div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="text-[10px] font-semibold" style={{ borderColor: TIER_COLORS[client.tier] + '55', color: TIER_COLORS[client.tier] }}>
                      {t(`pkg.${client.tier}`)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center font-semibold tabular-nums">{client.visits}</TableCell>
                  <TableCell>
                    {favSvc ? <span className="text-sm">{favSvc.emoji} {t(favSvc.nameKey)}</span> : '—'}
                  </TableCell>
                  <TableCell className="text-right font-semibold tabular-nums text-rose-600 dark:text-rose-400">
                    RM {client.totalSpent.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-amber-600 dark:text-amber-400 font-medium">
                    {client.points || 0}
                  </TableCell>
                  <TableCell className="text-xs tabular-nums">{client.lastVisit}</TableCell>
                  <TableCell>
                    {client.allergyKey ? (
                      <Badge variant="destructive" className="text-[10px]">⚠ {t(client.allergyKey)}</Badge>
                    ) : (
                      <span className="text-xs text-muted-foreground">{t('common.none')}</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-7 text-xs cursor-pointer gap-1" onClick={(e) => { e.stopPropagation(); onViewClient?.(client.id) }}>
                      <Eye size={13} /> {t('common.edit')}
                    </Button>
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
