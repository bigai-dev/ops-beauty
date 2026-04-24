import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'
import { MEMBERSHIP_TIERS } from '@/defaults'

const TIER_COLORS = { bronze: '#B45309', silver: '#6B7280', gold: '#D97706' }

export function ClientDetail({ clientId, onBack }) {
  const { clients, services, appointments, therapists, treatmentNotes, clientPackages, packageTemplates, addTreatmentNote, getClientTreatments } = useBeautyBookStore()
  const t = useT()

  const client = clients.find(c => c.id === clientId)
  if (!client) return <div className="page-enter"><Button variant="ghost" onClick={onBack}>← {t('common.close')}</Button><p>{t('common.noData')}</p></div>

  const clientAppts = appointments.filter(a => a.clientId === clientId || a.client === client.name).sort((a, b) => (b.date || '').localeCompare(a.date || ''))
  const treatments = getClientTreatments(clientId)
  const pkgs = clientPackages.filter(p => p.clientId === clientId)
  const favSvc = services.find(s => s.id === client.favSvcId)
  const tier = MEMBERSHIP_TIERS.slice().reverse().find(ti => client.totalSpent >= ti.minSpent) || MEMBERSHIP_TIERS[0]

  const [showAddNote, setShowAddNote] = useState(false)
  const [noteForm, setNoteForm] = useState({ notes: '', concerns: '', productsUsed: '', recommendations: '' })

  const handleAddNote = () => {
    if (!noteForm.notes) return
    addTreatmentNote({
      clientId,
      notes: noteForm.notes,
      concerns: noteForm.concerns.split(',').map(s => s.trim()).filter(Boolean),
      productsUsed: noteForm.productsUsed.split(',').map(s => s.trim()).filter(Boolean),
      recommendations: noteForm.recommendations,
    })
    setNoteForm({ notes: '', concerns: '', productsUsed: '', recommendations: '' })
    setShowAddNote(false)
  }

  return (
    <div className="page-enter space-y-6">
      <Button variant="ghost" size="sm" onClick={onBack}>← {t('common.close')}</Button>

      {/* Client Header */}
      <Card>
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-bold heading-font">{client.name}</h2>
              <p className="text-sm text-muted-foreground">{client.phone}</p>
              {client.allergyKey && <Badge variant="destructive" className="mt-1 text-xs">⚠ {t(client.allergyKey)}</Badge>}
            </div>
            <div className="text-right">
              <Badge className="text-sm" style={{ background: TIER_COLORS[tier.id] + '22', color: TIER_COLORS[tier.id], border: `1px solid ${TIER_COLORS[tier.id]}44` }}>
                {t(`pkg.${tier.id}`)}
              </Badge>
              <p className="text-xs text-muted-foreground mt-1">{client.points || 0} pts</p>
            </div>
          </div>
          <Separator className="my-3" />
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div><p className="text-muted-foreground text-xs">{t('client.visits', { n: '' })}</p><p className="font-bold">{client.visits}</p></div>
            <div><p className="text-muted-foreground text-xs">{t('client.totalSpent')}</p><p className="font-bold text-rose-600">RM {client.totalSpent.toLocaleString()}</p></div>
            <div><p className="text-muted-foreground text-xs">{t('client.favService')}</p><p className="font-medium">{favSvc ? `${favSvc.emoji} ${t(favSvc.nameKey)}` : '—'}</p></div>
            <div><p className="text-muted-foreground text-xs">{t('client.lastVisit')}</p><p className="font-medium">{client.lastVisit}</p></div>
          </div>
        </CardContent>
      </Card>

      {/* Active Packages */}
      {pkgs.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t('client.packages')}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {pkgs.map(cp => {
              const tpl = packageTemplates.find(p => p.id === cp.templateId)
              const remaining = cp.totalSessions - cp.usedSessions
              const isExpired = cp.expiryDate < new Date().toISOString().slice(0, 10)
              return (
                <Card key={cp.id}>
                  <CardContent className="p-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-sm">{tpl ? t(tpl.nameKey) : '—'}</span>
                      {isExpired ? (
                        <Badge variant="destructive" className="text-[10px]">{t('pkg.expired')}</Badge>
                      ) : (
                        <Badge className="bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 text-[10px]">{remaining} left</Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground mt-1">{t('pkg.used', { used: cp.usedSessions, total: cp.totalSessions })} · Expires {cp.expiryDate}</p>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Treatment History */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold text-muted-foreground">{t('client.treatmentHistory')}</h3>
          <Button size="sm" variant="outline" onClick={() => setShowAddNote(!showAddNote)}>+ {t('treat.addNote')}</Button>
        </div>

        {showAddNote && (
          <Card className="mb-3">
            <CardContent className="p-4 space-y-3">
              <div><label className="text-xs font-medium">{t('treat.notes')}</label><Input value={noteForm.notes} onChange={e => setNoteForm(f => ({ ...f, notes: e.target.value }))} placeholder="Treatment notes..." /></div>
              <div className="grid grid-cols-2 gap-3">
                <div><label className="text-xs font-medium">{t('treat.concerns')}</label><Input value={noteForm.concerns} onChange={e => setNoteForm(f => ({ ...f, concerns: e.target.value }))} placeholder="dryness, sensitivity" /></div>
                <div><label className="text-xs font-medium">{t('treat.products')}</label><Input value={noteForm.productsUsed} onChange={e => setNoteForm(f => ({ ...f, productsUsed: e.target.value }))} placeholder="Serum, Mask" /></div>
              </div>
              <div><label className="text-xs font-medium">{t('treat.recommendations')}</label><Input value={noteForm.recommendations} onChange={e => setNoteForm(f => ({ ...f, recommendations: e.target.value }))} placeholder="Follow-up in 2 weeks" /></div>
              <Button size="sm" onClick={handleAddNote}>{t('common.save')}</Button>
            </CardContent>
          </Card>
        )}

        <div className="space-y-3">
          {treatments.map(note => (
            <Card key={note.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <Badge variant="outline" className="text-xs tabular-nums">{note.date}</Badge>
                </div>
                <p className="text-sm">{note.notes}</p>
                {note.concerns?.length > 0 && (
                  <div className="flex gap-1 mt-2 flex-wrap">
                    {note.concerns.map(c => <Badge key={c} variant="secondary" className="text-[10px]">{c}</Badge>)}
                  </div>
                )}
                {note.productsUsed?.length > 0 && (
                  <p className="text-xs text-muted-foreground mt-1">🧴 {note.productsUsed.join(', ')}</p>
                )}
                {note.recommendations && (
                  <p className="text-xs text-emerald-600 mt-1">💡 {note.recommendations}</p>
                )}
              </CardContent>
            </Card>
          ))}

          {treatments.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-6">{t('common.noData')}</p>
          )}
        </div>
      </div>

      {/* Recent Appointments */}
      <div>
        <h3 className="text-sm font-semibold text-muted-foreground mb-2">{t('nav.appointments')}</h3>
        <div className="space-y-2">
          {clientAppts.slice(0, 10).map(a => {
            const svc = services.find(s => s.id === a.svcId)
            const th = therapists.find(thp => thp.id === a.tid)
            return (
              <Card key={a.id}>
                <CardContent className="p-3 flex items-center justify-between">
                  <div>
                    <span className="text-sm font-medium">{svc ? `${svc.emoji} ${t(svc.nameKey)}` : ''}</span>
                    <span className="text-xs text-muted-foreground ml-2">{th?.name}</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs tabular-nums">{a.date} {a.time}</span>
                    <Badge variant="outline" className="ml-2 text-[10px]">{a.status}</Badge>
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
