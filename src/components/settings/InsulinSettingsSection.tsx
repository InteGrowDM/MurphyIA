import { useState } from 'react';
import { Syringe, Clock, Edit2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DailyLogInputDialog, InsulinVariant } from '@/components/daily-log/DailyLogInputDialog';
import { Button } from '@/components/ui/button';

interface InsulinDose {
  units: number;
  timestamp: string;
}

interface InsulinSettingsSectionProps {
  rapidDose?: InsulinDose | null;
  basalDose?: InsulinDose | null;
  onRapidUpdate?: (units: number, notes?: string) => void;
  onBasalUpdate?: (units: number, notes?: string) => void;
}

const formatDate = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleDateString('es-ES', { 
    day: 'numeric', 
    month: 'short',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export function InsulinSettingsSection({ 
  rapidDose,
  basalDose,
  onRapidUpdate,
  onBasalUpdate
}: InsulinSettingsSectionProps) {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeVariant, setActiveVariant] = useState<InsulinVariant>('rapid');

  const openDialog = (variant: InsulinVariant) => {
    setActiveVariant(variant);
    setDialogOpen(true);
  };

  const handleSave = (units: number, notes?: string) => {
    if (activeVariant === 'rapid') {
      onRapidUpdate?.(units, notes);
    } else {
      onBasalUpdate?.(units, notes);
    }
  };

  const insulinCards = [
    {
      id: 'rapid',
      label: 'Insulina Rápida',
      description: 'Acción rápida para las comidas',
      dose: rapidDose,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      info: '1-3 veces al día según necesidad'
    },
    {
      id: 'basal',
      label: 'Insulina Basal',
      description: 'Acción prolongada',
      dose: basalDose,
      color: 'text-indigo-400',
      bgColor: 'bg-indigo-500/20',
      info: '1 vez al día, generalmente por la noche'
    }
  ] as const;

  return (
    <section className="space-y-4" aria-labelledby="insulin-settings-title">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-blue-500/20 flex items-center justify-center">
          <Syringe className="w-5 h-5 text-blue-400" />
        </div>
        <div>
          <h2 id="insulin-settings-title" className="font-semibold text-foreground">
            Tratamiento de Insulina
          </h2>
          <p className="text-sm text-muted-foreground">
            Gestiona tus dosis habituales
          </p>
        </div>
      </div>

      <div className="grid gap-3">
        {insulinCards.map((card) => (
          <div
            key={card.id}
            className="glass-card p-4 flex items-center gap-4"
          >
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0",
              card.bgColor
            )}>
              <Syringe className={cn("w-6 h-6", card.color)} />
            </div>

            <div className="flex-1 min-w-0">
              <p className="font-medium text-foreground">{card.label}</p>
              <p className="text-sm text-muted-foreground">{card.description}</p>
              
              {card.dose ? (
                <div className="flex items-center gap-2 mt-1 text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{card.dose.units} U</span>
                  <span>·</span>
                  <Clock className="w-3 h-3" />
                  <span>{formatDate(card.dose.timestamp)}</span>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {card.info}
                </p>
              )}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => openDialog(card.id)}
              className="shrink-0"
            >
              <Edit2 className="w-4 h-4 mr-1" />
              {card.dose ? 'Actualizar' : 'Registrar'}
            </Button>
          </div>
        ))}
      </div>

      <p className="text-xs text-muted-foreground px-1">
        💡 Las dosis de insulina se actualizan aquí cuando cambian por indicación médica.
      </p>

      {/* Insulin Dialog */}
      <DailyLogInputDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        type="insulin"
        variant={activeVariant}
        initialValue={activeVariant === 'rapid' ? rapidDose?.units : basalDose?.units}
        onSave={handleSave}
      />
    </section>
  );
}