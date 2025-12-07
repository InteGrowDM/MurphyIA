import { useState } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { InsulinConfigCard } from '@/components/insulin/InsulinConfigCard';
import { Card, CardContent } from '@/components/ui/card';
import { UserRole, InsulinSchedule } from '@/types/diabetes';
import { Activity } from 'lucide-react';

export default function Insulina() {
  const userRole: UserRole = 'patient';

  const [rapidSchedule, setRapidSchedule] = useState<InsulinSchedule | null>({
    type: 'rapid',
    timesPerDay: 3,
    unitsPerDose: 12
  });

  const [basalSchedule, setBasalSchedule] = useState<InsulinSchedule | null>({
    type: 'basal',
    timesPerDay: 1,
    unitsPerDose: 24
  });

  const totalDailyUnits = 
    (rapidSchedule ? rapidSchedule.timesPerDay * rapidSchedule.unitsPerDose : 0) +
    (basalSchedule ? basalSchedule.timesPerDay * basalSchedule.unitsPerDose : 0);

  const totalApplications = 
    (rapidSchedule?.timesPerDay ?? 0) + (basalSchedule?.timesPerDay ?? 0);

  return (
    <DashboardLayout userRole={userRole} userName="Carlos García">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Insulina</h1>
          <p className="text-muted-foreground mt-1">
            Configura tu régimen de insulina rápida y basal
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          <InsulinConfigCard
            type="rapid"
            title="Insulina Rápida"
            maxFrequency={6}
            schedule={rapidSchedule}
            onSave={setRapidSchedule}
          />

          <InsulinConfigCard
            type="basal"
            title="Insulina Basal"
            maxFrequency={2}
            schedule={basalSchedule}
            onSave={setBasalSchedule}
          />
        </div>

        {/* Summary card */}
        {totalDailyUnits > 0 && (
          <Card className="bg-gradient-to-r from-primary/10 to-primary/5 border-primary/20">
            <CardContent className="py-4">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/20">
                  <Activity className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Resumen diario</p>
                  <p className="font-medium">
                    {totalApplications} aplicaciones · {totalDailyUnits} unidades totales
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}
