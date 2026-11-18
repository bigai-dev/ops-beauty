import { useRef } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { TopBar } from '@/components/TopBar'
import { useBeautyBookStore } from '@/store'
import { useT } from '@/i18n'
import { LayoutDashboard, CalendarCheck, Users, Sparkles, UserCog, Package, Receipt, Gift, Tag, TrendingUp, Trophy } from 'lucide-react'

// Each admin screen has its own address under app/ (e.g. app/clients/page.jsx)
const ADMIN_VIEWS = [
  { id: 'dashboard', path: '/', labelKey: 'nav.dashboard', Icon: LayoutDashboard },
  { id: 'appointments', path: '/appointments', labelKey: 'nav.appointments', Icon: CalendarCheck },
  { id: 'clients', path: '/clients', labelKey: 'nav.clients', Icon: Users },
  { id: 'services', path: '/services', labelKey: 'nav.services', Icon: Sparkles },
  { id: 'staff', path: '/staff', labelKey: 'nav.staff', Icon: UserCog },
  { id: 'inventory', path: '/inventory', labelKey: 'nav.inventory', Icon: Package },
  { id: 'expenses', path: '/expenses', labelKey: 'nav.expenses', Icon: Receipt },
  { id: 'packages', path: '/packages', labelKey: 'nav.packages', Icon: Gift },
  { id: 'promotions', path: '/promotions', labelKey: 'nav.promotions', Icon: Tag },
  { id: 'financial', path: '/financial', labelKey: 'nav.financial', Icon: TrendingUp },
  { id: 'performance', path: '/performance', labelKey: 'nav.performance', Icon: Trophy },
]

const BOOKING_PATH = '/booking'

function isActivePath(pathname, path) {
  return path === '/' ? pathname === '/' : pathname === path || pathname.startsWith(`${path}/`)
}

// Top bar, admin sidebar and the admin/booking switch shared by every screen
export function BeautyBookLayout({ children }) {
  const pathname = usePathname()
  const router = useRouter()
  const { getNotifications, getPendingCount, resetAll } = useBeautyBookStore()
  const t = useT()
  const notifications = getNotifications()
  const pendingCount = getPendingCount()
  const topTab = isActivePath(pathname, BOOKING_PATH) ? 'booking' : 'admin'
  // Remember which admin screen was open so "Admin" returns to it
  const lastAdminPath = useRef('/')

  const openBooking = () => {
    if (topTab === 'admin') lastAdminPath.current = pathname
    router.push(BOOKING_PATH)
  }

  return (
    <div data-theme="beautybook" className="flex flex-col h-screen overflow-hidden">
      <TopBar
        notifications={notifications}
        logo={
          <div className="flex items-center gap-2 sm:gap-4 min-w-0">
            <h1 className="sidebar-logo flex items-center gap-2 shrink-0" style={{ fontSize: 18 }}>
              <span className="flex items-center justify-center shrink-0" style={{ width: 30, height: 30, background: 'linear-gradient(135deg, #EC4899, #8B5CF6)', borderRadius: 8, color: '#fff' }}>
                <Sparkles size={16} />
              </span>
              <span className="text-gradient-beauty hidden sm:inline">BeautyBook</span>
            </h1>
            <div className="flex gap-1">
              <Button variant={topTab === 'admin' ? 'default' : 'ghost'} size="sm" className="cursor-pointer text-xs sm:text-sm" onClick={() => router.push(lastAdminPath.current)}>
                <LayoutDashboard size={14} className="sm:mr-1" />
                <span className="hidden sm:inline">{t('nav.admin')}</span>
              </Button>
              <Button variant={topTab === 'booking' ? 'default' : 'ghost'} size="sm" className="cursor-pointer text-xs sm:text-sm" onClick={openBooking}>
                <CalendarCheck size={14} className="sm:mr-1" />
                <span className="hidden sm:inline">{t('nav.booking')}</span>
                {pendingCount > 0 && <Badge className="ml-1 h-4 min-w-4 px-1 text-[10px] bg-white text-primary font-bold">{pendingCount}</Badge>}
              </Button>
            </div>
            <Button variant="ghost" size="sm" className="text-red-400 ml-auto cursor-pointer hover:text-red-600 hover:bg-red-50 text-xs shrink-0" onClick={() => { resetAll(); window.location.reload() }}>{t('nav.reset')}</Button>
          </div>
        }
      />

      <div className="flex flex-1 overflow-hidden">
        {topTab === 'admin' && (
          <>
            <aside className="w-[200px] shrink-0 border-r border-border/60 p-3 overflow-y-auto hidden md:flex md:flex-col gap-0.5">
              {ADMIN_VIEWS.map(view => {
                const isActive = isActivePath(pathname, view.path)
                return (
                  <Link
                    key={view.id}
                    href={view.path}
                    aria-current={isActive ? 'page' : undefined}
                    className={`flex items-center gap-2.5 w-full px-3 py-2.5 rounded-xl text-[13px] transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-primary/10 text-primary font-semibold shadow-sm'
                        : 'text-foreground/70 hover:bg-accent hover:text-foreground font-medium'
                    }`}
                  >
                    <view.Icon size={16} strokeWidth={isActive ? 2.2 : 1.8} />
                    <span className="truncate">{t(view.labelKey)}</span>
                    {view.id === 'appointments' && pendingCount > 0 && (
                      <Badge variant="destructive" className="ml-auto h-4 min-w-4 px-1 text-[10px]">{pendingCount}</Badge>
                    )}
                  </Link>
                )
              })}
            </aside>
            <main className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--color-background)' }}>
              <div className="md:hidden flex gap-1 mb-4 overflow-x-auto pb-2">
                {ADMIN_VIEWS.map(view => (
                  <Button key={view.id} variant={isActivePath(pathname, view.path) ? 'default' : 'outline'} size="sm" className="shrink-0 text-xs cursor-pointer" onClick={() => router.push(view.path)}>
                    <view.Icon size={13} className="mr-1" /> {t(view.labelKey)}
                  </Button>
                ))}
              </div>
              {children}
            </main>
          </>
        )}

        {topTab === 'booking' && (
          <main className="flex-1 overflow-y-auto p-6" style={{ background: 'var(--color-background)' }}>
            {children}
          </main>
        )}
      </div>
    </div>
  )
}
