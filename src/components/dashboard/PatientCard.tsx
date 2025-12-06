import { 
  Activity, 
  Moon, 
  Syringe, 
  Brain, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  MessageCircle,
  Zap
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Patient } from '@/types/diabetes';

interface PatientCardProps {
  patient: Patient;
  onClick?: () => void;
  compact?: boolean;
}

export function PatientCard({ patient, onClick, compact = false }: PatientCardProps) {
  const latestGlucose = patient.glucometrias[0];
  const latestSleep = patient.sueno[0];
  const latestStress = patient.estres[0];
  const criticalAlerts = patient.alertas.filter(a => a.severity === 'critical' && !a.resolved);

  const getGlucoseStatus = (value: number) => {
    if (value < 70) return { status: 'critical', label: 'Bajo', color: 'text-destructive' };
    if (value < 80) return { status: 'warning', label: 'Límite bajo', color: 'text-warning' };
    if (value <= 130) return { status: 'success', label: 'Normal', color: 'text-success' };
    if (value <= 180) return { status: 'warning', label: 'Elevado', color: 'text-warning' };
    return { status: 'critical', label: 'Alto', color: 'text-destructive' };
  };

  const glucoseStatus = latestGlucose ? getGlucoseStatus(latestGlucose.value) : null;

  const getTrendIcon = () => {
    if (!patient.glucometrias.length || patient.glucometrias.length < 2) {
      return <Minus className="w-4 h-4 text-muted-foreground" />;
    }
    const diff = patient.glucometrias[0].value - patient.glucometrias[1].value;
    if (diff > 20) return <TrendingUp className="w-4 h-4 text-destructive" />;
    if (diff < -20) return <TrendingDown className="w-4 h-4 text-success" />;
    return <Minus className="w-4 h-4 text-muted-foreground" />;
  };

  if (compact) {
    return (
      <div 
        onClick={onClick}
        className={cn(
          "glass-card glow-border p-4 cursor-pointer transition-all duration-300",
          "hover:scale-[1.02] hover:shadow-glow-intense",
          criticalAlerts.length > 0 && "border-destructive/50 pulse-alert"
        )}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-purple flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-foreground">
              {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground truncate">{patient.name}</p>
            <p className="text-xs text-muted-foreground">{patient.diabetesType}</p>
          </div>
          {latestGlucose && (
            <div className="text-right">
              <p className={cn("text-lg font-bold", glucoseStatus?.color)}>
                {latestGlucose.value}
              </p>
              <p className="text-xs text-muted-foreground">mg/dL</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass-card glow-border overflow-hidden cursor-pointer transition-all duration-300",
        "hover:scale-[1.01] hover:shadow-glow-intense animate-fade-up",
        criticalAlerts.length > 0 && "border-destructive/50"
      )}
    >
      {/* Critical Alert Banner */}
      {criticalAlerts.length > 0 && (
        <div className="bg-destructive/20 border-b border-destructive/30 px-4 py-2 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-destructive animate-pulse" />
          <span className="text-sm font-medium text-destructive">
            {criticalAlerts.length} alerta{criticalAlerts.length > 1 ? 's' : ''} crítica{criticalAlerts.length > 1 ? 's' : ''}
          </span>
        </div>
      )}

      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-14 h-14 rounded-2xl bg-gradient-purple flex items-center justify-center shadow-glow">
              <span className="text-xl font-bold text-foreground">
                {patient.name.split(' ').map(n => n[0]).slice(0, 2).join('')}
              </span>
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">{patient.name}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-purple-500/20 text-purple-400">
                  {patient.diabetesType}
                </span>
                <span className="text-xs text-muted-foreground">
                  {patient.age} años • Estrato {patient.estrato}
                </span>
              </div>
            </div>
          </div>
          
          {/* Telegram Status */}
          <div className={cn(
            "p-2 rounded-lg",
            patient.telegramConnected ? "bg-success/20" : "bg-muted"
          )}>
            <MessageCircle className={cn(
              "w-4 h-4",
              patient.telegramConnected ? "text-success" : "text-muted-foreground"
            )} />
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-4">
          {/* Glucose */}
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-purple-400" />
              <span className="text-xs text-muted-foreground">Glucosa</span>
            </div>
            {latestGlucose ? (
              <div className="flex items-end gap-1">
                <span className={cn("text-2xl font-bold", glucoseStatus?.color)}>
                  {latestGlucose.value}
                </span>
                <span className="text-xs text-muted-foreground mb-1">mg/dL</span>
                {getTrendIcon()}
              </div>
            ) : (
              <span className="text-muted-foreground">Sin datos</span>
            )}
          </div>

          {/* Sleep */}
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="w-4 h-4 text-info" />
              <span className="text-xs text-muted-foreground">Sueño</span>
            </div>
            {latestSleep ? (
              <div className="flex items-end gap-1">
                <span className="text-2xl font-bold text-foreground">{latestSleep.hours}</span>
                <span className="text-xs text-muted-foreground mb-1">hrs</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Sin datos</span>
            )}
          </div>

          {/* Insulin */}
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Syringe className="w-4 h-4 text-warning" />
              <span className="text-xs text-muted-foreground">Insulina</span>
            </div>
            <div className="flex items-end gap-1">
              <span className="text-2xl font-bold text-foreground">
                {patient.insulina.reduce((sum, i) => sum + i.units, 0)}
              </span>
              <span className="text-xs text-muted-foreground mb-1">U/día</span>
            </div>
          </div>

          {/* Stress */}
          <div className="glass-card p-3 rounded-xl">
            <div className="flex items-center gap-2 mb-2">
              <Brain className="w-4 h-4 text-accent" />
              <span className="text-xs text-muted-foreground">Estrés</span>
            </div>
            {latestStress ? (
              <div className="flex items-end gap-1">
                <span className={cn(
                  "text-2xl font-bold",
                  latestStress.level >= 7 ? "text-destructive" : 
                  latestStress.level >= 5 ? "text-warning" : "text-success"
                )}>
                  {latestStress.level}
                </span>
                <span className="text-xs text-muted-foreground mb-1">/10</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Sin datos</span>
            )}
          </div>
        </div>

        {/* XP and Streak */}
        <div className="flex items-center justify-between pt-3 border-t border-border/50">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-purple flex items-center justify-center">
                <Zap className="w-4 h-4 text-foreground" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Nivel XP</p>
                <p className="font-semibold text-foreground">{patient.xpLevel}%</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-warning/20 flex items-center justify-center">
                <span className="text-warning">🔥</span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Racha</p>
                <p className="font-semibold text-foreground">{patient.streak} días</p>
              </div>
            </div>
          </div>
          
          <button className="btn-neon text-sm py-2 px-4">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );
}
