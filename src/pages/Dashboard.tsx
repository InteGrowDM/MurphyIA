import { useLocation } from 'react-router-dom';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { PatientCard } from '@/components/dashboard/PatientCard';
import { HabitTrackerCard } from '@/components/dashboard/HabitTrackerCard';
import { XPDonut } from '@/components/dashboard/XPDonut';
import { CRMList } from '@/components/dashboard/CRMList';
import { GlucoseChart } from '@/components/dashboard/GlucoseChart';
import { AlertsPanel } from '@/components/dashboard/AlertsPanel';
import { UserRole, Patient } from '@/types/diabetes';
import mockData from '@/data/mockPatients.json';
import { Activity, TrendingUp, Users, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Dashboard() {
  const location = useLocation();
  const userRole = (location.state?.role as UserRole) || 'patient';

  // Get mock data
  const patients = mockData.patients as Patient[];
  const aiReports = mockData.aiReports;
  
  // For demo, use first patient as current user
  const currentPatient = patients[0];
  const userName = userRole === 'doctor' 
    ? mockData.doctors[0].name 
    : userRole === 'coadmin' 
      ? mockData.coadmins[0].name 
      : currentPatient.name;

  const criticalCount = patients.reduce(
    (acc, p) => acc + p.alertas.filter(a => a.severity === 'critical' && !a.resolved).length, 
    0
  );

  // Stats cards data
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
      label: userRole === 'doctor' ? 'Pacientes activos' : 'Días en racha',
      value: userRole === 'doctor' ? patients.length.toString() : `${currentPatient.streak}`,
      icon: Users,
      color: 'text-info',
      bgColor: 'bg-info/20'
    },
    {
      label: 'Alertas críticas',
      value: userRole === 'doctor' ? criticalCount.toString() : currentPatient.alertas.filter(a => a.severity === 'critical' && !a.resolved).length.toString(),
      icon: AlertTriangle,
      color: 'text-destructive',
      bgColor: 'bg-destructive/20'
    }
  ];

  return (
    <DashboardLayout userRole={userRole} userName={userName}>
      {/* Page Header */}
      <header className="mb-6">
        <h1 className="text-hig-2xl md:text-hig-3xl font-bold text-foreground mb-2 leading-hig-tight">
          {userRole === 'doctor' ? 'CRM Médico' : 'Mi Dashboard'}
        </h1>
        <p className="text-muted-foreground text-hig-base leading-hig-normal">
          {userRole === 'doctor' 
            ? 'Gestiona tus pacientes con inteligencia artificial' 
            : 'Bienvenido de vuelta. Aquí tienes tu resumen del día.'}
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

      {/* Role-specific content */}
      {userRole === 'doctor' ? (
        <div className="grid lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <CRMList 
              patients={patients} 
              aiReports={aiReports as any}
            />
          </div>
          <div className="space-y-6">
            <AlertsPanel 
              alerts={patients.flatMap(p => p.alertas)}
            />
          </div>
        </div>
      ) : (
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
            
            <HabitTrackerCard />
            
            <AlertsPanel 
              alerts={currentPatient.alertas}
              compact
            />
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
