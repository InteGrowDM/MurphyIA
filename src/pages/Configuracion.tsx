import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { InsulinSettingsSection } from '@/components/settings/InsulinSettingsSection';
import { User, Bell, Shield, Smartphone } from 'lucide-react';
import { UserRole } from '@/types/diabetes';

export default function Configuracion() {
  const userRole: UserRole = 'patient';

  // Local state for insulin doses
  const [rapidDose, setRapidDose] = useState<{ units: number; timestamp: string } | null>({
    units: 12,
    timestamp: new Date().toISOString()
  });
  const [basalDose, setBasalDose] = useState<{ units: number; timestamp: string } | null>({
    units: 24,
    timestamp: new Date().toISOString()
  });

  const handleRapidUpdate = (units: number, notes?: string) => {
    setRapidDose({ units, timestamp: new Date().toISOString() });
  };

  const handleBasalUpdate = (units: number, notes?: string) => {
    setBasalDose({ units, timestamp: new Date().toISOString() });
  };
  
  return (
    <DashboardLayout userRole={userRole} userName="Carlos García">
      <div className="space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Configuración</h1>
          <p className="text-muted-foreground mt-1">Gestiona tu cuenta y preferencias</p>
        </div>

        {/* Insulin Settings Section */}
        <InsulinSettingsSection 
          rapidDose={rapidDose}
          basalDose={basalDose}
          onRapidUpdate={handleRapidUpdate}
          onBasalUpdate={handleBasalUpdate}
        />

        {/* Other Settings */}
        <section className="space-y-4">
          <h2 className="font-semibold text-foreground">Ajustes generales</h2>
          <div className="grid gap-3">
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
        </section>
      </div>
    </DashboardLayout>
  );
}