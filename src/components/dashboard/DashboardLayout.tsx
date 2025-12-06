import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Activity, 
  Bell, 
  Settings, 
  Menu, 
  X,
  Stethoscope,
  UserCircle,
  Bot,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/diabetes';

interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole: UserRole;
  userName: string;
}

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: UserRole[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['patient', 'coadmin', 'doctor'] },
  { label: 'Glucometrías', href: '/glucometrias', icon: Activity, roles: ['patient', 'coadmin'] },
  { label: 'Pacientes', href: '/pacientes', icon: Users, roles: ['doctor'] },
  { label: 'CRM IA', href: '/crm', icon: Bot, roles: ['doctor'] },
  { label: 'Shaun Murphy IA', href: '/ai', icon: Stethoscope, roles: ['patient', 'coadmin', 'doctor'] },
  { label: 'Telegram', href: '/telegram', icon: MessageCircle, roles: ['patient', 'coadmin', 'doctor'] },
  { label: 'Alertas', href: '/alertas', icon: Bell, roles: ['patient', 'coadmin', 'doctor'] },
  { label: 'Configuración', href: '/configuracion', icon: Settings, roles: ['patient', 'coadmin', 'doctor'] },
];

export function DashboardLayout({ children, userRole, userName }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const filteredNavItems = navItems.filter(item => item.roles.includes(userRole));

  const roleLabels: Record<UserRole, string> = {
    patient: 'Paciente',
    coadmin: 'Co-administrador',
    doctor: 'Médico',
  };

  const roleColors: Record<UserRole, string> = {
    patient: 'bg-purple-500/20 text-purple-400',
    coadmin: 'bg-info/20 text-info',
    doctor: 'bg-success/20 text-success',
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 glass-card border-b border-border/50 px-4 py-3">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setSidebarOpen(true)}
            className="p-2 rounded-lg hover:bg-secondary/50 transition-colors"
          >
            <Menu className="w-6 h-6 text-foreground" />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-purple flex items-center justify-center">
              <span className="text-sm font-bold text-foreground">DM</span>
            </div>
            <span className="font-semibold text-foreground glow-text">DiabetesManager</span>
          </div>

          <button className="p-2 rounded-lg hover:bg-secondary/50 transition-colors relative">
            <Bell className="w-6 h-6 text-foreground" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-destructive rounded-full" />
          </button>
        </div>
      </header>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={cn(
        "fixed top-0 left-0 z-50 h-full w-72 glass-card border-r border-border/50 transition-transform duration-300 ease-out",
        "lg:translate-x-0",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <div className="flex flex-col h-full p-4">
          {/* Logo */}
          <div className="flex items-center justify-between mb-8 pt-2">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-purple flex items-center justify-center shadow-glow">
                <Activity className="w-6 h-6 text-foreground glow-icon" />
              </div>
              <div>
                <h1 className="font-bold text-lg text-foreground glow-text">Diabetes</h1>
                <span className="text-xs text-muted-foreground">Manager Pro</span>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-2 rounded-lg hover:bg-secondary/50 transition-colors"
            >
              <X className="w-5 h-5 text-muted-foreground" />
            </button>
          </div>

          {/* User Info */}
          <div className="glass-card glow-border p-4 mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-purple flex items-center justify-center">
                <UserCircle className="w-7 h-7 text-foreground" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground truncate">{userName}</p>
                <span className={cn(
                  "inline-block px-2 py-0.5 rounded-full text-xs font-medium mt-1",
                  roleColors[userRole]
                )}>
                  {roleLabels[userRole]}
                </span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1">
            {filteredNavItems.map((item) => {
              const isActive = location.pathname === item.href;
              const Icon = item.icon;
              
              return (
                <Link
                  key={item.href}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200",
                    isActive 
                      ? "bg-gradient-purple text-foreground shadow-glow" 
                      : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                  )}
                >
                  <Icon className={cn("w-5 h-5", isActive && "glow-icon")} />
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Shaun Murphy IA Badge */}
          <div className="mt-auto pt-4 border-t border-border/50">
            <div className="glass-card p-4 glow-border">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center animate-pulse-ring">
                  <Bot className="w-5 h-5 text-foreground" />
                </div>
                <div>
                  <p className="font-semibold text-foreground text-sm">Shaun Murphy IA</p>
                  <p className="text-xs text-muted-foreground">Asistente activo</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "min-h-screen pt-16 lg:pt-0 lg:pl-72 transition-all duration-300"
      )}>
        <div className="p-4 lg:p-6 max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
