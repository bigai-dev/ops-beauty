import { useState, useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useDarkMode } from '@/lib/hooks/use-dark-mode'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { useT } from '@/i18n'
import { Bell, Sun, Moon } from 'lucide-react'

export function TopBar({ notifications = [], logo }) {
  const { isDark, toggle } = useDarkMode()
  const t = useT()
  const [showNotifications, setShowNotifications] = useState(false)
  const notifRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(e) {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setShowNotifications(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-2.5 border-b border-border/60 bg-card/80 backdrop-blur-sm">
      {logo && <div className="flex-1">{logo}</div>}
      {!logo && <div className="flex-1" />}

      <LanguageSwitcher />

      <div className="relative" ref={notifRef}>
        <Button
          variant="ghost"
          size="icon"
          className="h-9 w-9 relative cursor-pointer rounded-xl"
          aria-label={t('notif.title')}
          onClick={() => setShowNotifications(!showNotifications)}
        >
          <Bell size={17} />
          {notifications.length > 0 && (
            <Badge className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 text-[10px] bg-destructive text-destructive-foreground animate-in zoom-in duration-200">
              {notifications.length}
            </Badge>
          )}
        </Button>

        {showNotifications && notifications.length > 0 && (
          <div className="absolute right-0 top-full mt-2 w-72 bg-card border border-border rounded-xl shadow-lg z-50 overflow-hidden animate-in slide-in-from-top-2 fade-in duration-200">
            <div className="p-3 border-b border-border font-semibold text-sm heading-font">
              {t('notif.title')} ({notifications.length})
            </div>
            <div className="max-h-64 overflow-y-auto">
              {notifications.map((n, i) => (
                <div key={i} className="px-3 py-2.5 text-sm border-b border-border/50 last:border-0 hover:bg-accent/50 transition-colors">
                  {n.text || n}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Button variant="ghost" size="icon" className="h-9 w-9 cursor-pointer rounded-xl" onClick={toggle} aria-label={isDark ? 'Light mode' : 'Dark mode'}>
        {isDark ? <Sun size={17} /> : <Moon size={17} />}
      </Button>
    </div>
  )
}
