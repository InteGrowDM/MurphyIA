import { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PatientCard } from '@/components/dashboard/PatientCard';
import { HabitTrackerCard } from '@/components/dashboard/HabitTrackerCard';
import { XPDonut } from '@/components/dashboard/XPDonut';
import { GlucoseChart } from '@/components/dashboard/GlucoseChart';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { DailyLogInputDialog } from '@/components/daily-log/DailyLogInputDialog';
import { UserRole, Patient, DizzinessSymptom } from '@/types/diabetes';
import mockData from '@/data/mockPatients.json';
import { Activity, TrendingUp, Flame, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const location = useLocation();
  const userRole = (location.state?.role as UserRole) || 'patient';

  // Dialog states for wellness tracking
  const [sleepDialogOpen, setSleepDialogOpen] = useState(false);
  const [stressDialogOpen, setStressDialogOpen] = useState(false);
  const [dizzinessDialogOpen, setDizzinessDialogOpen] = useState(false);

  // Local state for wellness data
  const [sleepData, setSleepData] = useState<{ hours: number; quality: number } | null>(null);
  const [stressData, setStressData] = useState<{ level: number } | null>(null);
  const [dizzinessData, setDizzinessData] = useState<{ severity: number; count: number } | null>(null);

  // Get mock data
  const patients = mockData.patients as Patient[];
  
  // For demo, use first patient as current user
  const currentPatient = patients[0];
  const userName = userRole === 'coadmin' 
    ? mockData.coadmins[0].name 
    : currentPatient.name;

  // Stats cards data - simplified for patient/coadmin
  const stats = [
    {
      label: 'Última glucosa',
      value: `${currentPatient.glucometrias[0]?.value || '-'} mg/dL`,
      icon: Activity,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20'
    },
    {
      label: 'Tendencia semanal',
      value: '-5.2%',
      icon: TrendingUp,
      color: 'text-success',
      bgColor: 'bg-success/20'
    },
    {
      label: 'Días en racha',
      value: `${currentPatient.streak}`,
      icon: Flame,
      color: 'text-warning',
      bgColor: 'bg-warning/20'
    },
    {
      label: 'Alertas activas',
      value: currentPatient.alertas.filter(a => !a.resolved).length.toString(),
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/20'
    }
  ];

  // Wellness save handlers
  const handleSaveSleep = (hours: number, quality?: number) => {
    setSleepData({ hours, quality: quality ?? 5 });
  };

  const handleSaveStress = (level: number, notes?: string) => {
    setStressData({ level });
  };

  const handleSaveDizziness = (severity: number, symptoms?: DizzinessSymptom[], notes?: string) => {
    setDizzinessData(prev => ({
      severity,
      count: (prev?.count ?? 0) + 1
    }));
  };

  return (
    <DashboardLayout userRole={userRole} userName={userName}>
      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-hig-2xl md:text-hig-3xl font-bold text-foreground mb-2 leading-hig-tight">
          Mi Dashboard
        </h1>
        <p className="text-muted-foreground text-hig-base leading-hig-normal">
          Bienvenido de vuelta. Aquí tienes tu resumen del día.
        </p>
      </header>

      {/* Stats Grid - HIG: consistent spacing */}
      <section 
        className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6"
        role="list"
        aria-label="Estadísticas principales"
      >
        {stats.map((stat, index) => (
          <article 
            key={stat.label}
            role="listitem"
            className="glass-card p-4 animate-fade-up"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="flex items-center gap-3">
              <div className={cn(
                "w-10 h-10 rounded-hig flex items-center justify-center",
                stat.bgColor
              )}>
                <stat.icon className={cn("w-[var(--icon-md)] h-[var(--icon-md)]", stat.color)} aria-hidden="true" />
              </div>
              <div>
                <p className="text-hig-xs text-muted-foreground">{stat.label}</p>
                <p className="text-hig-xl font-bold text-foreground leading-hig-tight">{stat.value}</p>
              </div>
            </div>
          </article>
        ))}
      </section>

      {/* Main content grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Charts & Data */}
        <div className="lg:col-span-2 space-y-6">
          <GlucoseChart data={currentPatient.glucometrias} />
          
          {userRole === 'coadmin' && (
            <PatientCard patient={currentPatient} />
          )}
        </div>

        {/* Right Column - Tracking & XP */}
        <div className="space-y-6">
          <XPDonut 
            xpLevel={currentPatient.xpLevel} 
            streak={currentPatient.streak}
          />
          
          <HabitTrackerCard 
            sleepData={sleepData}
            stressData={stressData}
            dizzinessData={dizzinessData}
            onSleepClick={() => setSleepDialogOpen(true)}
            onStressClick={() => setStressDialogOpen(true)}
            onDizzinessClick={() => setDizzinessDialogOpen(true)}
          />
          
          <AlertsPanel 
            alerts={currentPatient.alertas}
            compact
          />
        </div>
      </div>

      {/* Wellness Dialogs */}
      <DailyLogInputDialog
        open={sleepDialogOpen}
        onOpenChange={setSleepDialogOpen}
        type="sleep"
        initialHours={sleepData?.hours}
        initialQuality={sleepData?.quality}
        onSave={handleSaveSleep}
      />

      <DailyLogInputDialog
        open={stressDialogOpen}
        onOpenChange={setStressDialogOpen}
        type="stress"
        initialLevel={stressData?.level}
        onSave={handleSaveStress}
      />

      <DailyLogInputDialog
        open={dizzinessDialogOpen}
        onOpenChange={setDizzinessDialogOpen}
        type="dizziness"
        initialSeverity={dizzinessData?.severity}
        onSave={handleSaveDizziness}
      />
    </DashboardLayout>
  );
}