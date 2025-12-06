import { 
  AlertTriangle, 
  Bell, 
  Check, 
  X, 
  Clock,
  TrendingUp,
  TrendingDown
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Alert, AlertSeverity } from '@/types/diabetes';

interface AlertsPanelProps {
  alerts: Alert[];
  onResolve?: (alertId: string) => void;
  onDismiss?: (alertId: string) => void;
  compact?: boolean;
}

export function AlertsPanel({ alerts, onResolve, onDismiss, compact = false }: AlertsPanelProps) {
  const unresolvedAlerts = alerts.filter(a => !a.resolved);
  const resolvedAlerts = alerts.filter(a => a.resolved);

  const severityConfig: Record<AlertSeverity, { 
    icon: typeof AlertTriangle; 
    color: string; 
    bgColor: string;
    borderColor: string;
  }> = {
    critical: { 
      icon: AlertTriangle, 
      color: 'text-destructive', 
      bgColor: 'bg-destructive/20',
      borderColor: 'border-destructive/50'
    },
    warning: { 
      icon: TrendingUp, 
      color: 'text-warning', 
      bgColor: 'bg-warning/20',
      borderColor: 'border-warning/50'
    },
    info: { 
      icon: Bell, 
      color: 'text-info', 
      bgColor: 'bg-info/20',
      borderColor: 'border-info/50'
    },
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `hace ${diffDays} día${diffDays > 1 ? 's' : ''}`;
    if (diffHours > 0) return `hace ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    return 'hace unos minutos';
  };

  if (compact) {
    return (
      <div className="space-y-2">
        {unresolvedAlerts.slice(0, 3).map(alert => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;
          
          return (
            <div 
              key={alert.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border",
                config.bgColor, config.borderColor,
                alert.severity === 'critical' && "pulse-alert"
              )}
            >
              <Icon className={cn("w-4 h-4 shrink-0", config.color)} />
              <p className="text-sm text-foreground flex-1 line-clamp-1">{alert.message}</p>
            </div>
          );
        })}
        {unresolvedAlerts.length > 3 && (
          <p className="text-xs text-muted-foreground text-center">
            +{unresolvedAlerts.length - 3} alertas más
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="glass-card glow-border overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn(
              "w-10 h-10 rounded-xl flex items-center justify-center",
              unresolvedAlerts.some(a => a.severity === 'critical') 
                ? "bg-destructive/20 animate-pulse" 
                : "bg-warning/20"
            )}>
              <Bell className={cn(
                "w-5 h-5",
                unresolvedAlerts.some(a => a.severity === 'critical') 
                  ? "text-destructive" 
                  : "text-warning"
              )} />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">Alertas</h3>
              <p className="text-sm text-muted-foreground">
                {unresolvedAlerts.length} pendiente{unresolvedAlerts.length !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="divide-y divide-border/50 max-h-[400px] overflow-y-auto">
        {unresolvedAlerts.length === 0 ? (
          <div className="p-8 text-center">
            <div className="w-12 h-12 rounded-full bg-success/20 flex items-center justify-center mx-auto mb-3">
              <Check className="w-6 h-6 text-success" />
            </div>
            <p className="text-foreground font-medium">¡Todo en orden!</p>
            <p className="text-sm text-muted-foreground">No hay alertas pendientes</p>
          </div>
        ) : (
          unresolvedAlerts.map((alert, index) => {
            const config = severityConfig[alert.severity];
            const Icon = config.icon;
            
            return (
              <div 
                key={alert.id}
                className={cn(
                  "p-4 transition-colors hover:bg-secondary/20",
                  alert.severity === 'critical' && "bg-destructive/5"
                )}
                style={{ animationDelay: `${index * 0.05}s` }}
              >
                <div className="flex items-start gap-3">
                  <div className={cn(
                    "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                    config.bgColor,
                    alert.severity === 'critical' && "animate-pulse"
                  )}>
                    <Icon className={cn("w-5 h-5", config.color)} />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <p className="text-foreground font-medium">{alert.message}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="w-3 h-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">
                        {formatTime(alert.timestamp)}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button 
                      onClick={() => onResolve?.(alert.id)}
                      className="p-2 rounded-lg hover:bg-success/20 text-muted-foreground hover:text-success transition-colors"
                      title="Marcar como resuelto"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                    <button 
                      onClick={() => onDismiss?.(alert.id)}
                      className="p-2 rounded-lg hover:bg-destructive/20 text-muted-foreground hover:text-destructive transition-colors"
                      title="Descartar"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Resolved Section */}
      {resolvedAlerts.length > 0 && (
        <div className="p-4 border-t border-border/50 bg-secondary/10">
          <p className="text-xs text-muted-foreground mb-2">
            Resueltas recientemente ({resolvedAlerts.length})
          </p>
          <div className="space-y-2">
            {resolvedAlerts.slice(0, 2).map(alert => (
              <div key={alert.id} className="flex items-center gap-2 text-sm text-muted-foreground">
                <Check className="w-3 h-3 text-success" />
                <span className="line-clamp-1">{alert.message}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
