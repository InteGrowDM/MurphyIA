import { useState } from 'react';
import { 
  Activity, 
  Moon, 
  Syringe, 
  Brain,
  Check,
  Plus,
  Calendar
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface HabitItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
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

  const handleToggle = (id: string) => {
    setLocalHabits(prev => 
      prev.map(h => h.id === id ? { ...h, completed: !h.completed } : h)
    );
    onToggle?.(id);
  };

  return (
    <div className="glass-card glow-border overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground">Seguimiento Diario</h3>
            <div className="flex items-center gap-2 mt-1">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              <span className="text-sm text-muted-foreground capitalize">{date}</span>
            </div>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-foreground">{completedCount}/{localHabits.length}</p>
            <p className="text-xs text-muted-foreground">completados</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-purple rounded-full transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
          <div 
            className="absolute inset-y-0 left-0 bg-gradient-purple rounded-full blur-sm opacity-50 transition-all duration-500 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Habits List */}
      <div className="p-5 space-y-3">
        {localHabits.map((habit, index) => {
          const Icon = habit.icon;
          return (
            <div 
              key={habit.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl transition-all duration-300",
                "hover:bg-secondary/30 cursor-pointer group",
                habit.completed ? "bg-secondary/20" : "bg-transparent"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
              onClick={() => handleToggle(habit.id)}
            >
              {/* Icon */}
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300",
                habit.bgColor,
                habit.completed && "shadow-glow"
              )}>
                <Icon className={cn("w-5 h-5", habit.color)} />
              </div>

              {/* Label & Value */}
              <div className="flex-1 min-w-0">
                <p className={cn(
                  "font-medium transition-colors",
                  habit.completed ? "text-foreground" : "text-muted-foreground"
                )}>
                  {habit.label}
                </p>
                {habit.value && (
                  <p className="text-sm text-muted-foreground">{habit.value}</p>
                )}
              </div>

              {/* Action Button */}
              <div className={cn(
                "w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-300",
                habit.completed 
                  ? "bg-success/20 text-success" 
                  : "bg-muted text-muted-foreground group-hover:bg-purple-500/20 group-hover:text-purple-400"
              )}>
                {habit.completed ? (
                  <Check className="w-4 h-4" />
                ) : (
                  <Plus className="w-4 h-4" />
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="px-5 pb-5">
        <button className="w-full btn-neon flex items-center justify-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar registro
        </button>
      </div>
    </div>
  );
}
