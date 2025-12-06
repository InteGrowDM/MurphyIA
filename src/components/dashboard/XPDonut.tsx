import { useEffect, useState } from 'react';
import { Zap, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

interface XPDonutProps {
  xpLevel: number;
  streak: number;
  nextLevelXP?: number;
  currentXP?: number;
  animate?: boolean;
}

export function XPDonut({ 
  xpLevel, 
  streak, 
  nextLevelXP = 1000,
  currentXP = 780,
  animate = true 
}: XPDonutProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0);
  
  const progress = xpLevel;
  const circumference = 2 * Math.PI * 45; // radius = 45
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference;

  useEffect(() => {
    if (animate) {
      const timer = setTimeout(() => {
        setAnimatedProgress(progress);
      }, 300);
      return () => clearTimeout(timer);
    } else {
      setAnimatedProgress(progress);
    }
  }, [progress, animate]);

  const getLevelTitle = (level: number) => {
    if (level >= 90) return 'Maestro del Control';
    if (level >= 70) return 'Experto en Glucemia';
    if (level >= 50) return 'Aprendiz Avanzado';
    if (level >= 30) return 'En Progreso';
    return 'Principiante';
  };

  return (
    <div className="glass-card glow-border p-6 animate-fade-up">
      <div className="flex flex-col lg:flex-row items-center gap-6">
        {/* Donut Chart */}
        <div className="relative">
          <svg 
            className="w-36 h-36 transform -rotate-90"
            viewBox="0 0 100 100"
          >
            {/* Background Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="hsl(var(--muted))"
              strokeWidth="8"
            />
            
            {/* Progress Circle */}
            <circle
              cx="50"
              cy="50"
              r="45"
              fill="none"
              stroke="url(#purpleGradient)"
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              className="transition-all duration-1000 ease-out"
              style={{
                filter: 'drop-shadow(0 0 8px hsl(273 100% 71% / 0.6))'
              }}
            />

            {/* Gradient Definition */}
            <defs>
              <linearGradient id="purpleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="hsl(265, 100%, 60%)" />
                <stop offset="50%" stopColor="hsl(273, 100%, 71%)" />
                <stop offset="100%" stopColor="hsl(280, 100%, 77%)" />
              </linearGradient>
            </defs>
          </svg>

          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <Zap className="w-6 h-6 text-purple-400 glow-icon mb-1" />
            <span className="text-3xl font-bold text-foreground glow-text">
              {animatedProgress.toFixed(0)}%
            </span>
            <span className="text-xs text-muted-foreground">XP Level</span>
          </div>
        </div>

        {/* Stats */}
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-foreground mb-1">
              {getLevelTitle(xpLevel)}
            </h3>
            <p className="text-sm text-muted-foreground">
              ¡Continúa así para subir de nivel!
            </p>
          </div>

          {/* XP Progress */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progreso XP</span>
              <span className="text-foreground font-medium">{currentXP} / {nextLevelXP}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-purple rounded-full transition-all duration-1000"
                style={{ width: `${(currentXP / nextLevelXP) * 100}%` }}
              />
            </div>
          </div>

          {/* Streak & Awards */}
          <div className="grid grid-cols-2 gap-3">
            <div className="glass-card p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                  <span className="text-lg">🔥</span>
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Racha</p>
                  <p className="font-semibold text-foreground">{streak} días</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-3 rounded-xl">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-success/20 flex items-center justify-center">
                  <Award className="w-4 h-4 text-success" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Logros</p>
                  <p className="font-semibold text-foreground">12 obtenidos</p>
                </div>
              </div>
            </div>
          </div>

          {/* Next Reward */}
          <div className="flex items-center gap-3 p-3 rounded-xl bg-purple-500/10 border border-purple-500/20">
            <TrendingUp className="w-5 h-5 text-purple-400" />
            <div className="flex-1">
              <p className="text-sm font-medium text-foreground">Próxima recompensa</p>
              <p className="text-xs text-muted-foreground">Logra 85% para desbloquear "Control Premium"</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
