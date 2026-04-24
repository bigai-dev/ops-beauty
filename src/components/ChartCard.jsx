import { Card, CardContent } from '@/components/ui/card'

export function ChartCard({ title, icon, children, className = '' }) {
  return (
    <Card className={`card-hover ${className}`}>
      {title && (
        <div style={{ padding: '18px 20px 0' }}>
          <h3 className="chart-title flex items-center gap-2">
            {icon && <span className="text-primary opacity-70">{icon}</span>}
            {title}
          </h3>
        </div>
      )}
      <CardContent style={{ padding: '14px 20px 20px' }}>
        {children}
      </CardContent>
    </Card>
  )
}
