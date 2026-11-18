import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'
import { useToast } from '@/components/ToastProvider'
import { TIME_SLOTS } from '@/defaults'

export function Booking() {
  const { services, therapists, clients, addAppointment, addClient, isTimeBooked, validatePromoCode, applyPromotion } = useBeautyBookStore()
  const t = useT()
  const { showChain } = useToast()

  const [step, setStep] = useState(0)
  const [svcId, setSvcId] = useState(null)
  const [tid, setTid] = useState(null)
  const [time, setTime] = useState(null)
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [selectedClientId, setSelectedClientId] = useState(null)
  const [clientSearch, setClientSearch] = useState('')
  const [promoCode, setPromoCode] = useState('')
  const [appliedPromo, setAppliedPromo] = useState(null)
  const [promoError, setPromoError] = useState('')

  // Filter matching clients for autocomplete
  const matchingClients = clientSearch.length >= 2
    ? clients.filter(c => c.name.toLowerCase().includes(clientSearch.toLowerCase()) || c.phone.includes(clientSearch))
    : []

  const STEPS = [t('book.step1'), t('book.step2'), t('book.step3'), t('book.step4')]

  const selectedSvc = services.find(s => s.id === svcId)
  const selectedTherapist = therapists.find(th => th.id === tid)

  const getDiscount = () => {
    if (!appliedPromo || !selectedSvc) return 0
    if (appliedPromo.type === 'percentage') return Math.round(selectedSvc.price * appliedPromo.value / 100)
    return appliedPromo.value
  }

  const canNext = step === 0 ? !!svcId : step === 1 ? !!(tid && time) : step === 2 ? true : true

  const handleApplyPromo = () => {
    setPromoError('')
    if (!promoCode.trim()) return
    const promo = validatePromoCode(promoCode, svcId)
    if (promo) {
      setAppliedPromo(promo)
      setPromoError('')
    } else {
      setAppliedPromo(null)
      setPromoError(t('book.promoInvalid'))
    }
  }

  const handleNext = () => {
    if (step === 2) {
      // Link to existing client or create new
      let clientId = selectedClientId
      const clientName = name || t('book.defaultClient')
      const clientPhone = phone || '—'
      if (!clientId && clientName && clientPhone !== '—') {
        const existing = clients.find(c => c.phone === clientPhone)
        if (existing) {
          clientId = existing.id
        } else {
          clientId = addClient({ name: clientName, phone: clientPhone, prefKey: '', allergyKey: '', lastVisit: new Date().toISOString().slice(0, 10), favSvcId: svcId })
        }
      }

      const discount = getDiscount()
      addAppointment({
        client: clientName,
        clientId: clientId || null,
        phone: clientPhone,
        svcId,
        tid,
        time,
        status: 'pending',
        promoId: appliedPromo?.id || null,
        discountAmount: discount,
      })
      if (appliedPromo) applyPromotion(appliedPromo.id)
      showChain([
        { text: `🎉 ${t('book.toastSubmitted')}`, type: 'success' },
        { text: `📅 ${t('book.toastDetails', { svc: t(selectedSvc.nameKey), therapist: selectedTherapist.name, time })}`, type: 'info' },
        { text: `📊 ${t('book.toastSynced')}`, type: 'info' },
      ])
      import('canvas-confetti').then(m => m.default({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#BE185D', '#7C3AED', '#0D9488'] }))
      setStep(3)
      return
    }
    setStep(s => s + 1)
  }

  const handleReset = () => {
    setStep(0); setSvcId(null); setTid(null); setTime(null); setName(''); setPhone(''); setSelectedClientId(null); setClientSearch(''); setPromoCode(''); setAppliedPromo(null); setPromoError('')
  }

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in duration-300">
      <div className="flex items-center gap-2 mb-6">
        {STEPS.map((label, i) => (
          <div key={i} className="flex items-center gap-2 flex-1">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
              i <= step ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
            }`}>
              {i < step ? '✓' : i + 1}
            </div>
            <span className={`text-xs hidden sm:block ${i <= step ? 'text-foreground font-medium' : 'text-muted-foreground'}`}>{label}</span>
            {i < STEPS.length - 1 && <div className={`flex-1 h-0.5 ${i < step ? 'bg-primary' : 'bg-muted'}`} />}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {services.map(svc => (
            <Card key={svc.id} className={`cursor-pointer transition-all ${svcId === svc.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`} onClick={() => setSvcId(svc.id)}>
              <CardContent className="p-4 text-center">
                <div className="text-2xl mb-1">{svc.emoji}</div>
                <p className="font-semibold text-sm">{t(svc.nameKey)}</p>
                <p className="text-xs text-muted-foreground">{t(svc.descKey)}</p>
                <p className="text-xs font-bold text-rose-600 dark:text-rose-400 mt-1">RM {svc.price} · {t('book.minutes', { n: svc.dur })}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <div>
            <h3 className="text-sm font-semibold mb-2">{t('book.selectTherapist')}</h3>
            <div className="flex gap-3">
              {therapists.map(th => (
                <Card key={th.id} className={`cursor-pointer flex-1 transition-all ${tid === th.id ? 'ring-2 ring-primary' : 'hover:shadow-md'}`} onClick={() => setTid(th.id)}>
                  <CardContent className="p-3 text-center">
                    <div className="w-10 h-10 rounded-full mx-auto mb-1 flex items-center justify-center font-bold text-sm" style={{ background: th.bg, color: th.c }}>{th.ini}</div>
                    <p className="text-sm font-semibold" style={{ color: th.c }}>{th.name}</p>
                    <p className="text-xs text-muted-foreground">{t(th.roleKey)}</p>
                    <Badge variant="outline" className="text-xs mt-1">⭐ {th.rating}</Badge>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-sm font-semibold mb-2">{t('book.selectTime')}</h3>
            <div className="grid grid-cols-6 gap-1.5">
              {TIME_SLOTS.map(slot => {
                const booked = tid ? isTimeBooked(tid, slot) : false
                return (
                  <Button key={slot} variant={time === slot ? 'default' : 'outline'} size="sm" className={`text-xs ${booked ? 'opacity-30 cursor-not-allowed' : ''}`} disabled={booked} onClick={() => setTime(slot)}>
                    {slot}
                  </Button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <Card>
          <CardContent className="p-6 space-y-5">
            <div className="space-y-1.5 relative">
              <Label>{t('book.name')}</Label>
              <Input
                value={name}
                onChange={e => {
                  setName(e.target.value)
                  setClientSearch(e.target.value)
                  setSelectedClientId(null)
                }}
                placeholder={t('book.namePlaceholder')}
              />
              {matchingClients.length > 0 && !selectedClientId && (
                <div className="absolute z-10 top-full left-0 right-0 mt-1 bg-card border border-border rounded-lg shadow-lg max-h-40 overflow-y-auto">
                  {matchingClients.map(c => (
                    <button
                      key={c.id}
                      className="w-full text-left px-3 py-2 text-sm hover:bg-accent cursor-pointer flex justify-between"
                      onClick={() => { setName(c.name); setPhone(c.phone); setSelectedClientId(c.id); setClientSearch('') }}
                    >
                      <span className="font-medium">{c.name}</span>
                      <span className="text-muted-foreground text-xs">{c.phone}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <div className="space-y-1.5"><Label>{t('book.phone')}</Label><Input value={phone} onChange={e => setPhone(e.target.value)} placeholder={t('book.phonePlaceholder')} /></div>
            <div className="space-y-1.5">
              <Label>{t('book.promoCode')}</Label>
              <div className="flex gap-2">
                <Input value={promoCode} onChange={e => setPromoCode(e.target.value)} placeholder={t('book.promoPlaceholder')} />
                <Button variant="outline" size="sm" className="cursor-pointer shrink-0" onClick={handleApplyPromo}>{t('book.applyPromo')}</Button>
              </div>
              {appliedPromo && <p className="text-xs text-emerald-600 mt-1">{t('book.promoApplied', { value: appliedPromo.type === 'percentage' ? `${appliedPromo.value}%` : `RM${appliedPromo.value}` })}</p>}
              {promoError && <p className="text-xs text-red-500 mt-1">{promoError}</p>}
            </div>
            {selectedSvc && (
              <div className="border-t pt-3 mt-3 space-y-1 text-sm">
                <div className="flex justify-between"><span>{t('book.total')}</span><span className="font-bold">RM {selectedSvc.price}</span></div>
                {getDiscount() > 0 && <div className="flex justify-between text-emerald-600"><span>{t('book.discount')}</span><span>-RM {getDiscount()}</span></div>}
                {getDiscount() > 0 && <div className="flex justify-between font-bold text-lg border-t pt-1"><span>{t('book.total')}</span><span className="text-rose-600">RM {selectedSvc.price - getDiscount()}</span></div>}
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {step === 3 && (
        <Card>
          <CardContent className="p-6 text-center space-y-3">
            <div className="text-4xl">🎉</div>
            <h3 className="text-lg font-bold heading-font">{t('book.success')}</h3>
            <div className="text-sm text-muted-foreground">
              <p>{selectedSvc ? t(selectedSvc.nameKey) : ''} · {selectedTherapist?.name}</p>
              <p>{t('appt.time')}: {time}</p>
              <p>{t('appt.client')}: {name || t('book.defaultClient')}</p>
              {getDiscount() > 0 && <p className="text-emerald-600 font-medium mt-1">{t('book.discount')}: -RM {getDiscount()}</p>}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="flex gap-3 mt-6">
        {step > 0 && step < 3 && (
          <Button variant="outline" onClick={() => setStep(s => s - 1)}>← {t('book.prev')}</Button>
        )}
        {step < 3 ? (
          <Button className="ml-auto" disabled={!canNext} onClick={handleNext}>
            {step === 2 ? `${t('book.submit')} →` : `${t('book.next')} →`}
          </Button>
        ) : (
          <Button className="ml-auto" onClick={handleReset}>{t('book.newBooking')}</Button>
        )}
      </div>
    </div>
  )
}
