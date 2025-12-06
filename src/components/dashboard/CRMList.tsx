import { useState } from 'react';
import { 
  AlertTriangle, 
  Clock, 
  TrendingDown, 
  TrendingUp,
  ChevronRight,
  Filter,
  Search,
  Bot,
  Phone,
  MessageCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Patient, AIReport } from '@/types/diabetes';

interface CRMListProps {
  patients: Patient[];
  aiReports?: AIReport[];
  onPatientClick?: (patientId: string) => void;
}

type PriorityLevel = 'critical' | 'high' | 'medium' | 'low';

interface EnrichedPatient extends Patient {
  priority: PriorityLevel;
  aiInsight?: string;
  lastContact?: string;
}

export function CRMList({ patients, aiReports = [], onPatientClick }: CRMListProps) {
  const [filter, setFilter] = useState<PriorityLevel | 'all'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Enrich patients with priority and AI insights
  const enrichedPatients: EnrichedPatient[] = patients.map(patient => {
    const criticalAlerts = patient.alertas.filter(a => a.severity === 'critical' && !a.resolved);
    const warningAlerts = patient.alertas.filter(a => a.severity === 'warning' && !a.resolved);
    const report = aiReports.find(r => r.patientId === patient.id);

    let priority: PriorityLevel = 'low';
    let aiInsight = '';

    if (criticalAlerts.length > 0) {
      priority = 'critical';
      aiInsight = criticalAlerts[0].message;
    } else if (warningAlerts.length > 0 || (report?.summary.trend === 'deteriorating')) {
      priority = 'high';
      aiInsight = report?.recommendations[0] || warningAlerts[0]?.message || '';
    } else if (patient.streak < 3 || patient.xpLevel < 40) {
      priority = 'medium';
      aiInsight = 'Adherencia baja al tratamiento. Requiere seguimiento.';
    } else {
      aiInsight = 'Control estable. Mantener seguimiento regular.';
    }

    return {
      ...patient,
      priority,
      aiInsight,
      lastContact: '2 días atrás'
    };
  });

  // Sort by priority
  const priorityOrder: Record<PriorityLevel, number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3
  };

  const sortedPatients = [...enrichedPatients].sort(
    (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
  );

  const filteredPatients = sortedPatients.filter(p => {
    const matchesFilter = filter === 'all' || p.priority === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const priorityConfig: Record<PriorityLevel, { label: string; color: string; bgColor: string; icon: typeof AlertTriangle }> = {
    critical: { label: 'Crítico', color: 'text-destructive', bgColor: 'bg-destructive/20', icon: AlertTriangle },
    high: { label: 'Alto', color: 'text-warning', bgColor: 'bg-warning/20', icon: TrendingUp },
    medium: { label: 'Medio', color: 'text-info', bgColor: 'bg-info/20', icon: Clock },
    low: { label: 'Bajo', color: 'text-success', bgColor: 'bg-success/20', icon: TrendingDown },
  };

  const priorityCounts = {
    all: enrichedPatients.length,
    critical: enrichedPatients.filter(p => p.priority === 'critical').length,
    high: enrichedPatients.filter(p => p.priority === 'high').length,
    medium: enrichedPatients.filter(p => p.priority === 'medium').length,
    low: enrichedPatients.filter(p => p.priority === 'low').length,
  };

  return (
    <div className="glass-card glow-border overflow-hidden animate-fade-up">
      {/* Header */}
      <div className="p-5 border-b border-border/50">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-purple flex items-center justify-center shadow-glow">
              <Bot className="w-5 h-5 text-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg text-foreground">CRM Médico IA</h3>
              <p className="text-sm text-muted-foreground">Priorizado por Shaun Murphy</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-foreground">{priorityCounts.critical}</span>
            <span className="text-sm text-destructive">críticos</span>
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Buscar paciente..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-secondary/50 border border-border/50 rounded-xl text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 transition-all"
          />
        </div>

        {/* Priority Filters */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          <button
            onClick={() => setFilter('all')}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all",
              filter === 'all' 
                ? "bg-gradient-purple text-foreground shadow-glow" 
                : "bg-secondary/50 text-muted-foreground hover:text-foreground"
            )}
          >
            Todos ({priorityCounts.all})
          </button>
          {(Object.keys(priorityConfig) as PriorityLevel[]).map(key => {
            const config = priorityConfig[key];
            return (
              <button
                key={key}
                onClick={() => setFilter(key)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all flex items-center gap-1.5",
                  filter === key 
                    ? `${config.bgColor} ${config.color} border border-current` 
                    : "bg-secondary/50 text-muted-foreground hover:text-foreground"
                )}
              >
                <config.icon className="w-3.5 h-3.5" />
                {config.label} ({priorityCounts[key]})
              </button>
            );
          })}
        </div>
      </div>

      {/* Patient List */}
      <div className="divide-y divide-border/50 max-h-[500px] overflow-y-auto">
        {filteredPatients.map((patient, index) => {
          const config = priorityConfig[patient.priority];
          const PriorityIcon = config.icon;
          
          return (
            <div
              key={patient.id}
              onClick={() => onPatientClick?.(patient.id)}
              className={cn(
                "p-4 hover:bg-secondary/30 cursor-pointer transition-all duration-200 group",
                patient.priority === 'critical' && "bg-destructive/5"
              )}
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <div className="flex items-start gap-3">
                {/* Priority Indicator */}
                <div className={cn(
                  "w-10 h-10 rounded-xl flex items-center justify-center shrink-0",
                  config.bgColor,
                  patient.priority === 'critical' && "animate-pulse"
                )}>
                  <PriorityIcon className={cn("w-5 h-5", config.color)} />
                </div>

                {/* Patient Info */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold text-foreground truncate">{patient.name}</h4>
                    <span className={cn(
                      "px-2 py-0.5 rounded-full text-xs font-medium",
                      config.bgColor, config.color
                    )}>
                      {config.label}
                    </span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground mb-2">
                    {patient.diabetesType} • {patient.age} años
                  </p>

                  {/* AI Insight */}
                  <div className="flex items-start gap-2 p-2 rounded-lg bg-purple-500/10 border border-purple-500/20">
                    <Bot className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {patient.aiInsight}
                    </p>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-3">
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-xs">
                      <Phone className="w-3.5 h-3.5" />
                      Llamar
                    </button>
                    <button className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-secondary/50 text-muted-foreground hover:text-foreground hover:bg-secondary transition-colors text-xs">
                      <MessageCircle className="w-3.5 h-3.5" />
                      Telegram
                    </button>
                    <span className="text-xs text-muted-foreground ml-auto">
                      {patient.lastContact}
                    </span>
                  </div>
                </div>

                {/* Chevron */}
                <ChevronRight className="w-5 h-5 text-muted-foreground group-hover:text-foreground group-hover:translate-x-1 transition-all shrink-0" />
              </div>
            </div>
          );
        })}

        {filteredPatients.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-muted-foreground">No se encontraron pacientes</p>
          </div>
        )}
      </div>
    </div>
  );
}
