import { Card, CardContent } from '@/components/ui/card'
import { useCountUp } from '@/lib/hooks/use-count-up'
import { useT } from '@/i18n'

export function KpiCard({ title, value, prefix = '', suffix = '', icon, color = 'primary', trend, hero = false }) {
  const animatedValue = useCountUp(value)
  const t = useT()

  const colorMap = {
    primary: { bg: 'bg-primary/10', text: 'text-primary', iconGlow: 'rgba(236,72,153,0.15)' },
    green: { bg: 'bg-emerald-500/10', text: 'text-emerald-600 dark:text-emerald-400', iconGlow: 'rgba(16,185,129,0.15)' },
    amber: { bg: 'bg-amber-500/10', text: 'text-amber-600 dark:text-amber-400', iconGlow: 'rgba(245,158,11,0.15)' },
    red: { bg: 'bg-red-500/10', text: 'text-red-600 dark:text-red-400', iconGlow: 'rgba(239,68,68,0.15)' },
    purple: { bg: 'bg-purple-500/10', text: 'text-purple-600 dark:text-purple-400', iconGlow: 'rgba(139,92,246,0.15)' },
    blue: { bg: 'bg-blue-500/10', text: 'text-blue-600 dark:text-blue-400', iconGlow: 'rgba(59,130,246,0.15)' },
  }

  const c = colorMap[color] || colorMap.primary

  if (hero) {
    return (
      <Card className="border-0 overflow-hidden h-full" style={{ background: 'var(--demo-kpi-hero, linear-gradient(135deg, #EC4899, #8B5CF6))', boxShadow: '0 12px 30px -6px rgba(236,72,153,0.35), 0 6px 12px -4px rgba(139,92,246,0.2)' }}>
        <CardContent className="text-white relative" style={{ padding: '20px' }}>
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.3), transparent 60%)' }} />
          <div className="flex items-center gap-4 relative">
            {icon && (
              <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}>
                {icon}
              </div>
            )}
            <div className="min-w-0">
              <p className="kpi-label" style={{ color: 'rgba(255,255,255,0.75)' }}>{title}</p>
              <p className="kpi-value" style={{ color: '#fff' }}>
                {prefix}{typeof value === 'number' ? animatedValue.toLocaleString() : value}{suffix}
              </p>
              {trend !== undefined && (
                <p className="text-xs mt-0.5 font-medium" style={{ color: 'rgba(255,255,255,0.85)' }}>
                  {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}% {t('dash.vsYesterday')}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="card-hover h-full">
      <CardContent className="flex items-center gap-4" style={{ padding: '20px' }}>
        {icon && (
          <div className={`kpi-icon ${c.bg} ${c.text}`} style={{ boxShadow: `0 4px 12px ${c.iconGlow}` }}>
            {icon}
          </div>
        )}
        <div className="min-w-0">
          <p className="kpi-label truncate">{title}</p>
          <p className="kpi-value">
            {prefix}{typeof value === 'number' ? animatedValue.toLocaleString() : value}{suffix}
          </p>
          {trend !== undefined && (
            <p className={`text-xs mt-0.5 font-medium ${trend >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
              {trend >= 0 ? '↑' : '↓'} {Math.abs(trend)}%
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
