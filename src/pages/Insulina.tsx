import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { InsulinSettingsSection } from '@/components/settings/InsulinSettingsSection';
import { UserRole } from '@/types/diabetes';

export default function Insulina() {
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
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Insulina</h1>
          <p className="text-muted-foreground mt-1">Gestiona tus dosis de insulina rápida y basal</p>
        </div>

        <InsulinSettingsSection 
          rapidDose={rapidDose}
          basalDose={basalDose}
          onRapidUpdate={handleRapidUpdate}
          onBasalUpdate={handleBasalUpdate}
        />
      </div>
    </DashboardLayout>
  );
}
