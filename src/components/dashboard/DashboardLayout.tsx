import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Activity, 
  Bell, 
  Settings, 
  Menu, 
  X,
  Stethoscope,
  UserCircle,
  Bot,
  MessageCircle,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/diabetes';
import { useIsMobile } from '@/hooks/use-mobile';
import { MobileBottomNav } from '@/components/navigation/MobileBottomNav';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  userName: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: LucideIcon;
  roles: UserRole[];
}

interface NavGroup {
  label: string;
  items: NavItem[];
}

// Simplified navigation for patient and coadmin only
const navGroups: NavGroup[] = [
  {
    label: 'Principal',
    items: [
      { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['patient', 'coadmin'] },
      { label: 'Glucometrías', href: '/glucometrias', icon: Activity, roles: ['patient', 'coadmin'] },
    ]
  },
  {
    label: 'Comunicación',
    items: [
      { label: 'Shaun Murphy IA', href: '/ai', icon: Stethoscope, roles: ['patient', 'coadmin'] },
      { label: 'Telegram', href: '/telegram', icon: MessageCircle, roles: ['patient', 'coadmin'] },
      { label: 'Alertas', href: '/alertas', icon: Bell, roles: ['patient', 'coadmin'] },
    ]
  },
  {
    label: 'Sistema',
    items: [
      { label: 'Configuración', href: '/configuracion', icon: Settings, roles: ['patient', 'coadmin'] },
    ]
  }
];

export function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const isMobile = useIsMobile();

  // Filter groups and items based on user role
  const filteredNavGroups = navGroups
    .map(group => ({
      ...group,
      items: group.items.filter(item => item.roles.includes(userRole))
    }))
    .filter(group => group.items.length > 0);

  const roleLabels: Record<UserRole, string> = {
    patient: 'Paciente',
    coadmin: 'Co-administrador',
  };

  const roleColors: Record<UserRole, string> = {
    patient: 'bg-purple-500/20 text-purple-400',
    coadmin: 'bg-info/20 text-info',
  };

  const handleCloseSidebar = () => setSidebarOpen(false);
  const handleOpenSidebar = () => setSidebarOpen(true);

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header - Simplified (nav is in bottom bar) */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-14 glass-card border-b border-border/50 px-4 safe-area-inset">
        <div className="flex items-center justify-center h-full">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-hig bg-gradient-purple flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">DM</span>
            </div>
            <span className="font-semibold text-foreground">DiabetesManager</span>
          </div>
        </div>
      </header>

      {/* Mobile Sidebar Overlay - HIG: Improved depth */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/40 backdrop-blur-md z-50 animate-fade-in"
          onClick={handleCloseSidebar}
          aria-hidden="true"
        />
      )}

      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed top-0 left-0 z-50 h-full w-72 glass-card border-r border-border/50",
          "transition-transform duration-hig-slow ease-hig-out",
          "lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
        aria-label="Navegación principal"
      >
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-6 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-hig bg-gradient-purple flex items-center justify-center elevation-1">
                <Activity className="w-[var(--icon-lg)] h-[var(--icon-lg)] text-foreground" />
              </div>
              <div>
                <h1 className="font-bold text-hig-lg text-foreground leading-hig-tight">Diabetes</h1>
                <span className="text-hig-xs text-muted-foreground">Manager Pro</span>
              </div>
            </div>
            <button
              onClick={handleCloseSidebar}
              aria-label="Cerrar menú"
              className="lg:hidden touch-target flex items-center justify-center rounded-hig hover:bg-secondary/50 transition-colors duration-hig-fast focus-ring press-feedback"
            >
              <X className="w-[var(--icon-md)] h-[var(--icon-md)] text-muted-foreground" />
            </button>
          </div>

          {/* User Info */}
          <div className="glass-card p-4 mb-6 elevation-1">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-hig-lg bg-gradient-purple flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate text-hig-base">{userName}</p>
                <span className={cn(
                  "inline-block px-2 py-0.5 rounded-full text-hig-xs font-medium mt-1",
                  roleColors[userRole]
                )}>
                  {roleLabels[userRole]}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation - HIG: Grouped structure */}
          <nav className="flex-1 overflow-y-auto" aria-label="Menú principal">
            {filteredNavGroups.map((group, groupIndex) => (
              <div key={group.label} className="mb-4">
                {/* Group separator (except first) */}
                {groupIndex > 0 && (
                  <div className="border-t border-border/30 mb-4" />
                )}
                
                {/* Group label */}
                <h2 className="px-3 mb-2 text-hig-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {group.label}
                </h2>
                
                {/* Group items */}
                <ul className="space-y-1" role="list">
                  {group.items.map((item) => {
                    const isActive = location.pathname === item.href;
                    const Icon = item.icon;
                    
                    return (
                      <li key={item.href}>
                        <Link
                          to={item.href}
                          onClick={handleCloseSidebar}
                          aria-current={isActive ? 'page' : undefined}
                          aria-label={`Ir a ${item.label}`}
                          className={cn(
                            "group flex items-center gap-3 px-3 py-2.5 rounded-hig",
                            "transition-all duration-hig-fast ease-hig-out",
                            "focus-ring press-feedback",
                            "min-h-[var(--touch-target-min)]",
                            isActive 
                              ? "bg-primary/15 text-foreground" 
                              : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                          )}
                        >
                          {/* HIG: Subtle active indicator */}
                          <div className={cn(
                            "absolute left-0 w-1 h-6 rounded-r-full transition-all duration-hig-fast",
                            isActive 
                              ? "bg-primary opacity-100" 
                              : "opacity-0"
                          )} />
                          
                          <Icon className={cn(
                            "w-[var(--icon-md)] h-[var(--icon-md)] shrink-0",
                            "transition-colors duration-hig-fast",
                            isActive && "text-primary"
                          )} />
                          <span className={cn(
                            "font-medium text-hig-sm",
                            isActive && "text-foreground"
                          )}>
                            {item.label}
                          </span>
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </nav>

          {/* Shaun Murphy IA Badge */}
          <div className="mt-auto pt-4 border-t border-border/30">
            <div className="glass-card p-4 elevation-1">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center">
                  <Bot className="w-[var(--icon-md)] h-[var(--icon-md)] text-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-hig-sm">Shaun Murphy IA</p>
                  <p className="text-hig-xs text-muted-foreground">Asistente activo</p>
                </div>
                {/* Status indicator */}
                <div className="ml-auto w-2 h-2 rounded-full bg-success animate-pulse" aria-label="Activo" />
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main 
        className={cn(
          "min-h-screen pt-14 lg:pt-0 lg:pl-72",
          "transition-all duration-hig-slow ease-hig-out",
          isMobile && "pb-20"
        )}
        id="main-content"
      >
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      {isMobile && <MobileBottomNav />}
    </div>
  );
}