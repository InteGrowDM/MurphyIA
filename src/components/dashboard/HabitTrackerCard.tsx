import { useState, useCallback } from 'react';
import { 
  Activity, 
  Moon, 
  Syringe, 
  Brain,
  Check,
  Plus,
  Calendar,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitItem {
  id: string;
  label: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  completed: boolean;
  value?: string;
}

interface HabitTrackerCardProps {
  date?: string;
  habits?: HabitItem[];
  onToggle?: (id: string) => void;
  onAdd?: (id: string) => void;
}

const defaultHabits: HabitItem[] = [
  { 
    id: 'glucose_morning', 
    label: 'Glucosa matutina', 
    icon: Activity, 
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    completed: true,
    value: '125 mg/dL'
  },
  { 
    id: 'glucose_lunch', 
    label: 'Glucosa almuerzo', 
    icon: Activity, 
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    completed: true,
    value: '142 mg/dL'
  },
  { 
    id: 'glucose_dinner', 
    label: 'Glucosa cena', 
    icon: Activity, 
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/20',
    completed: false
  },
  { 
    id: 'insulin_rapid', 
    label: 'Insulina rápida', 
    icon: Syringe, 
    color: 'text-warning',
    bgColor: 'bg-warning/20',
    completed: true,
    value: '12 U'
  },
  { 
    id: 'insulin_basal', 
    label: 'Insulina basal', 
    icon: Syringe, 
    color: 'text-warning',
    bgColor: 'bg-warning/20',
    completed: false
  },
  { 
    id: 'sleep', 
    label: 'Registro de sueño', 
    icon: Moon, 
    color: 'text-info',
    bgColor: 'bg-info/20',
    completed: true,
    value: '7.5 hrs'
  },
  { 
    id: 'stress', 
    label: 'Nivel de estrés', 
    icon: Brain, 
    color: 'text-accent',
    bgColor: 'bg-accent/20',
    completed: false
  },
];

export function HabitTrackerCard({ 
  date = new Date().toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
  habits = defaultHabits,
  onToggle,
  onAdd
}: HabitTrackerCardProps) {
  const [localHabits, setLocalHabits] = useState(habits);
  
  const completedCount = localHabits.filter(h => h.completed).length;
  const progress = (completedCount / localHabits.length) * 100;

  const handleToggle = useCallback((id: string) => {
    setLocalHabits(prev => 
      prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h)
    );
    onToggle?.(id);
  }, [onToggle]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent, id: string) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      handleToggle(id);
    }
  }, [handleToggle]);

  return (
    <section 
      className="glass-card overflow-hidden animate-fade-up"
      aria-labelledby="habit-tracker-title"
    >
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 id="habit-tracker-title" className="font-semibold text-hig-lg text-foreground leading-hig-tight">
              Seguimiento Diario
            </h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-[var(--icon-sm)] h-[var(--icon-sm)] text-muted-foreground" aria-hidden="true" />
              <span className="text-hig-sm text-muted-foreground capitalize">{date}</span>
            </div>
          </div>
          <div className="text-right" aria-label={`${completedCount} de ${localHabits.length} completados`}>
            <p className="text-hig-2xl font-bold text-foreground leading-hig-tight">{completedCount}/{localHabits.length}</p>
            <p className="text-hig-xs text-muted-foreground">completados</p>
          </div>
        </div>

        {/* Progress Bar - HIG: thinner, 6px */}
        <div 
          className="relative h-1.5 bg-muted rounded-full overflow-hidden"
          role="progressbar"
          aria-valuenow={progress}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label="Progreso diario"
        >
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-purple rounded-full transition-all duration-hig-slow ease-hig-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Habits List */}
      <ul className="p-5 space-y-2" role="list" aria-label="Lista de hábitos">
        {localHabits.map((habit, index) => {
          const Icon = habit.icon;
          return (
            <li 
              key={habit.id}
              role="listitem"
              tabIndex={0}
              aria-checked={habit.completed}
              onKeyDown={(e) => handleKeyDown(e, habit.id)}
              className={cn(
                "flex items-center gap-3 p-3 rounded-hig cursor-pointer",
                "transition-all duration-hig-fast ease-hig-out",
                "hover:bg-secondary/30 focus-ring press-feedback",
                "min-h-[var(--touch-target-comfortable)]",
                habit.completed ? "bg-secondary/20" : "bg-transparent"
              )}
              style={{ animationDelay: `${index * 0.03}s` }}
              onClick={() => handleToggle(habit.id)}
            >
              {/* Icon */}
              <div className={cn(
                "w-10 h-10 rounded-hig flex items-center justify-center shrink-0",
                "transition-shadow duration-hig-fast",
                habit.bgColor,
                habit.completed && "elevation-1"
              )}>
                <Icon className={cn("w-[var(--icon-md)] h-[var(--icon-md)]", habit.color)} aria-hidden="true" />
              </div>

              {/* Label & Value */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium text-hig-base transition-colors duration-hig-fast",
                  habit.completed ? "text-foreground" : "text-muted-foreground"
                )}>
                  {habit.label}
                </p>
                {habit.value && (
                  <p className="text-hig-sm text-muted-foreground">{habit.value}</p>
                )}
              </div>

              {/* Action Button - HIG: 44px touch target */}
              <div className={cn(
                "w-10 h-10 rounded-hig flex items-center justify-center",
                "transition-all duration-hig-normal ease-hig-spring",
                habit.completed 
                  ? "bg-success/20 text-success" 
                  : "bg-muted text-muted-foreground group-hover:bg-purple-500/20 group-hover:text-purple-400"
              )}>
                {habit.completed ? (
                  <Check className="w-[var(--icon-md)] h-[var(--icon-md)] animate-scale-in" aria-label="Completado" />
                ) : (
                  <Plus className="w-[var(--icon-md)] h-[var(--icon-md)]" aria-label="Marcar como completado" />
                )}
              </div>
            </li>
          );
        })}
      </ul>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button 
          className="w-full btn-neon flex items-center justify-center gap-2 focus-ring"
          aria-label="Agregar nuevo registro"
        >
          <Plus className="w-[var(--icon-sm)] h-[var(--icon-sm)]" aria-hidden="true" />
          Agregar registro
        </button>
      </div>
    </section>
  );
}
