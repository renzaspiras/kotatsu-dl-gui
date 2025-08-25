import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { 
  BookOpen, 
  Download, 
  Settings, 
  Sun, 
  Moon, 
  Monitor 
} from 'lucide-react'
import { useTheme } from '@/components/theme-provider'

const sidebarItems = [
  {
    title: 'Manga List',
    href: '/',
    icon: BookOpen,
  },
  {
    title: 'Downloads',
    href: '/downloads', 
    icon: Download,
  },
  {
    title: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export default function Sidebar() {
  const location = useLocation()
  const { theme, setTheme } = useTheme()
  const [collapsed, setCollapsed] = useState(false)

  const toggleTheme = () => {
    if (theme === 'light') {
      setTheme('dark')
    } else if (theme === 'dark') {
      setTheme('system')
    } else {
      setTheme('light')
    }
  }

  const getThemeIcon = () => {
    switch (theme) {
      case 'light':
        return Sun
      case 'dark':
        return Moon
      default:
        return Monitor
    }
  }

  const ThemeIcon = getThemeIcon()

  return (
    <div className={cn(
      "flex flex-col bg-card border-r transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <h1 className="text-lg font-semibold">Kotatsu DL</h1>
          )}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="ml-auto"
          >
            <BookOpen className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <nav className="flex-1 p-4">
        <div className="space-y-2">
          {sidebarItems.map((item) => {
            const Icon = item.icon
            const isActive = location.pathname === item.href
            
            return (
              <Link key={item.href} to={item.href}>
                <Button
                  variant={isActive ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start",
                    collapsed && "px-2"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  {!collapsed && (
                    <span className="ml-2">{item.title}</span>
                  )}
                </Button>
              </Link>
            )
          })}
        </div>
      </nav>

      <div className="p-4 border-t">
        <Button
          variant="ghost"
          onClick={toggleTheme}
          className={cn(
            "w-full justify-start",
            collapsed && "px-2"
          )}
        >
          <ThemeIcon className="h-4 w-4" />
          {!collapsed && (
            <span className="ml-2">
              {theme === 'light' ? 'Light' : theme === 'dark' ? 'Dark' : 'System'}
            </span>
          )}
        </Button>
      </div>
    </div>
  )
}