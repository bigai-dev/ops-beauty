import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'
import { MEMBERSHIP_TIERS } from '@/defaults'

const TIER_COLORS = { bronze: '#B45309', silver: '#6B7280', gold: '#D97706' }
const TIER_EMOJIS = { bronze: '🥉', silver: '🥈', gold: '🥇' }

export function Packages() {
  const { packageTemplates, clientPackages, clients, services, purchasePackage } = useBeautyBookStore()
  const t = useT()
  const [showPurchase, setShowPurchase] = useState(null)

  const handlePurchase = (templateId) => {
    if (!showPurchase) return
    purchasePackage(showPurchase, templateId)
    setShowPurchase(null)
  }

  return (
    <div className="page-enter space-y-6">
      <h2 className="text-lg font-bold heading-font">{t('pkg.title')}</h2>

      {/* Membership Tiers */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t('pkg.memberTier')}</h3>
        <div className="grid grid-cols-3 gap-3">
          {MEMBERSHIP_TIERS.map(tier => (
            <Card key={tier.id} className="text-center">
              <CardContent className="p-4">
                <div className="text-2xl mb-1">{TIER_EMOJIS[tier.id]}</div>
                <h4 className="font-bold" style={{ color: TIER_COLORS[tier.id] }}>{t(`pkg.${tier.id}`)}</h4>
                <p className="text-xs text-muted-foreground mt-1">RM {tier.minSpent}+</p>
                <div className="mt-2 space-y-0.5 text-xs">
                  <p>{t('pkg.pointsMultiplier', { n: tier.pointsMultiplier })}</p>
                  {tier.discount > 0 && <p className="text-emerald-600">{t('pkg.discount', { n: tier.discount })}</p>}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Package Templates */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t('pkg.templates')}</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {packageTemplates.filter(p => p.active).map(tpl => {
            const svc = services.find(s => s.id === tpl.svcId)
            const normalPrice = svc ? svc.price * tpl.sessions : 0
            const savingsPct = normalPrice > 0 ? Math.round((1 - tpl.price / normalPrice) * 100) : 0
            return (
              <Card key={tpl.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-sm">{t(tpl.nameKey)}</h4>
                    {savingsPct > 0 && <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px]">{t('pkg.savings', { pct: savingsPct })}</Badge>}
                  </div>
                  <p className="text-xs text-muted-foreground">{svc ? `${svc.emoji} ${t(svc.nameKey)}` : ''}</p>
                  <p className="text-xs text-muted-foreground">{t('pkg.sessions', { n: tpl.sessions })} · {t('pkg.validDays', { n: tpl.validDays })}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-rose-600 dark:text-rose-400">RM {tpl.price}</span>
                    {normalPrice > 0 && <span className="text-xs text-muted-foreground line-through">RM {normalPrice}</span>}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      </div>

      {/* Active Client Packages */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-3">{t('pkg.active')}</h3>
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t('appt.client')}</TableHead>
                <TableHead>{t('inv.product')}</TableHead>
                <TableHead className="text-center">{t('appt.status')}</TableHead>
                <TableHead>{t('promo.period')}</TableHead>
                <TableHead className="text-right">{t('exp.amount')}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clientPackages.map(cp => {
                const client = clients.find(c => c.id === cp.clientId)
                const tpl = packageTemplates.find(p => p.id === cp.templateId)
                const isExpired = cp.expiryDate < new Date().toISOString().slice(0, 10)
                const remaining = cp.totalSessions - cp.usedSessions
                return (
                  <TableRow key={cp.id}>
                    <TableCell className="font-medium">{client?.name || '—'}</TableCell>
                    <TableCell>{tpl ? t(tpl.nameKey) : '—'}</TableCell>
                    <TableCell className="text-center">
                      {isExpired ? (
                        <Badge variant="destructive" className="text-xs">{t('pkg.expired')}</Badge>
                      ) : (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-xs">
                          {t('pkg.used', { used: cp.usedSessions, total: cp.totalSessions })} ({remaining} left)
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-xs tabular-nums">{cp.purchaseDate} → {cp.expiryDate}</TableCell>
                    <TableCell className="text-right font-semibold tabular-nums">RM {cp.amountPaid}</TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  )
}
