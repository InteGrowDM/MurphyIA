import { 
  Moon, 
  Brain,
  Sparkles,
  Calendar,
  History,
  HeartPulse,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { WellnessHistoryType } from '@/components/wellness/WellnessHistorySheet';

interface WellnessItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  value?: string;
  status?: 'pending' | 'recorded';
}

interface HabitTrackerCardProps {
  date?: string;
  sleepData?: { hours: number; quality: number } | null;
  stressData?: { level: number } | null;
  dizzinessData?: { severity: number; count: number } | null;
  bloodPressureData?: { systolic: number; diastolic: number } | null;
  onSleepClick: () => void;
  onStressClick: () => void;
  onDizzinessClick: () => void;
  onBloodPressureClick: () => void;
  onViewHistory?: (type: WellnessHistoryType) => void;
}

const STRESS_LABELS = ['Muy relajado', 'Relajado', 'Normal', 'Algo tenso', 'Tenso', 'Estresado', 'Muy estresado', 'Agotado', 'Crítico', 'Emergencia'];

export function HabitTrackerCard({ 
  date = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
  sleepData,
  stressData,
  dizzinessData,
  bloodPressureData,
  onSleepClick,
  onStressClick,
  onDizzinessClick,
  onBloodPressureClick,
  onViewHistory
}: HabitTrackerCardProps) {
  
  // Build wellness items with current data
  const wellnessItems: WellnessItem[] = [
    { 
      id: 'sleep', 
      label: 'Sueño', 
      icon: Moon, 
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      value: sleepData ? `${sleepData.hours}h · ${sleepData.quality}/10` : undefined,
      status: sleepData ? 'recorded' : 'pending'
    },
    { 
      id: 'stress', 
      label: 'Estrés', 
      icon: Brain, 
      color: 'text-rose-400',
      bgColor: 'bg-rose-500/20',
      value: stressData ? STRESS_LABELS[stressData.level - 1] : undefined,
      status: stressData ? 'recorded' : 'pending'
    },
    { 
      id: 'dizziness', 
      label: 'Mareos', 
      icon: Sparkles, 
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      value: dizzinessData ? `${dizzinessData.count} episodio(s)` : undefined,
      status: dizzinessData ? 'recorded' : 'pending'
    },
    { 
      id: 'blood_pressure', 
      label: 'Tensión', 
      icon: HeartPulse, 
      color: 'text-red-400',
      bgColor: 'bg-red-500/20',
      value: bloodPressureData ? `${bloodPressureData.systolic}/${bloodPressureData.diastolic} mmHg` : undefined,
      status: bloodPressureData ? 'recorded' : 'pending'
    },
  ];

  const recordedCount = wellnessItems.filter(item => item.status === 'recorded').length;

  const handleItemClick = (id: string) => {
    switch (id) {
      case 'sleep':
        onSleepClick();
        break;
      case 'stress':
        onStressClick();
        break;
      case 'dizziness':
        onDizzinessClick();
        break;
      case 'blood_pressure':
        onBloodPressureClick();
        break;
    }
  };

  return (
    <section 
      className="glass-card overflow-hidden animate-fade-up"
      aria-labelledby="wellness-tracker-title"
    >
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 id="wellness-tracker-title" className="font-semibold text-hig-lg text-foreground leading-hig-tight">
              Bienestar Diario
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-[var(--icon-sm)] h-[var(--icon-sm)] text-muted-foreground" aria-hidden="true" />
              <span className="text-hig-sm text-muted-foreground capitalize">{date}</span>
            </div>
          </div>
          <div className="text-right" aria-label={`${recordedCount} de ${wellnessItems.length} registrados`}>
            <p className="text-hig-2xl font-bold text-foreground leading-hig-tight">{recordedCount}/{wellnessItems.length}</p>
            <p className="text-hig-xs text-muted-foreground">registrados</p>
          </div>
        </div>

        {/* Progress indicator */}
        <div className="flex gap-1.5">
          {wellnessItems.map((item) => (
            <div 
              key={item.id}
              className={cn(
                "flex-1 h-1.5 rounded-full transition-colors",
                item.status === 'recorded' ? 'bg-success' : 'bg-muted'
              )}
            />
          ))}
        </div>
      </div>

      {/* Wellness Items Grid - Responsive 4 columns */}
      <div 
        className="p-5 grid grid-cols-2 md:grid-cols-4 gap-3" 
        role="list" 
        aria-label="Lista de bienestar"
      >
      {wellnessItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <button
              key={item.id}
              type="button"
              role="listitem"
              onClick={() => handleItemClick(item.id)}
              className={cn(
                "flex flex-col items-center gap-2 p-3 md:p-4 rounded-hig",
                "transition-all duration-hig-fast ease-hig-out",
                "hover:bg-secondary/40 focus-ring press-feedback",
                "min-h-[var(--touch-target-comfortable)]",
                item.status === 'recorded' 
                  ? "bg-secondary/30 border border-border/50" 
                  : "bg-secondary/10 border border-transparent"
              )}
              style={{ animationDelay: `${index * 0.03}s` }}
              aria-label={`${item.label}: ${item.value || 'Sin registrar'}`}
            >
              {/* Icon */}
              <div className={cn(
                "w-12 h-12 rounded-hig flex items-center justify-center shrink-0",
                "transition-shadow duration-hig-fast",
                item.bgColor,
                item.status === 'recorded' && "elevation-1"
              )}>
                <Icon className={cn("w-6 h-6", item.color)} aria-hidden="true" />
              </div>

              {/* Label & Value */}
              <div className="text-center w-full">
                <p className={cn(
                  "font-medium text-hig-sm transition-colors duration-hig-fast",
                  item.status === 'recorded' ? "text-foreground" : "text-muted-foreground"
                )}>
                  {item.label}
                </p>
                <p className={cn(
                  "text-hig-xs mt-0.5 truncate",
                  item.status === 'recorded' ? "text-muted-foreground" : "text-muted-foreground/60"
                )}>
                  {item.value || <><span className="action-text-adaptive" /> para registrar</>}
                </p>
              </div>

              {/* History button */}
              {onViewHistory && (
                <button
                  type="button"
                  onClick={(e) => { e.stopPropagation(); onViewHistory(item.id as WellnessHistoryType); }}
                  className="p-1.5 rounded-full hover:bg-secondary/60 focus-ring"
                  aria-label={`Ver historial de ${item.label}`}
                >
                  <History className="w-3.5 h-3.5 text-muted-foreground/70" aria-hidden="true" />
                </button>
              )}
            </button>
          );
        })}
      </div>
    </section>
  );
}