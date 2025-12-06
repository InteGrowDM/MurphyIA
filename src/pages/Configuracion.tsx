import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { Settings, User, Bell, Shield, Smartphone } from 'lucide-react';
import { UserRole } from '@/types/diabetes';

export default function Configuracion() {
  const userRole: UserRole = 'patient';
  
  return (
    <DashboardLayout userRole={userRole} userName="Carlos García">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu cuenta y preferencias</p>
        </div>
        
        <div className="grid gap-4">
          {[
            { icon: User, label: 'Datos personales', description: 'Nombre, email, fecha de nacimiento' },
            { icon: Shield, label: 'Seguridad', description: 'Contraseña y autenticación' },
            { icon: Bell, label: 'Notificaciones', description: 'Alertas y recordatorios' },
            { icon: Smartphone, label: 'Dispositivos', description: 'Glucómetros conectados' },
          ].map((item) => (
            <button
              key={item.label}
              className="glass-card p-4 flex items-center gap-4 text-left hover:bg-secondary/30 transition-colors"
            >
              <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                <item.icon className="w-5 h-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
            </button>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
