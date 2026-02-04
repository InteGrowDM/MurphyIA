import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Moon, Brain, Sparkles, HeartPulse } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export type WellnessHistoryType = 'sleep' | 'stress' | 'dizziness' | 'blood_pressure';

interface WellnessHistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: WellnessHistoryType;
  data: any[];
}

const CONFIG = {
  sleep: { icon: Moon, title: 'Historial de Sueño', unit: 'horas' },
  stress: { icon: Brain, title: 'Historial de Estrés', unit: '/10' },
  dizziness: { icon: Sparkles, title: 'Historial de Mareos', unit: '/5' },
  blood_pressure: { icon: HeartPulse, title: 'Historial de Tensión', unit: 'mmHg' },
};

export function WellnessHistorySheet({ open, onOpenChange, type, data }: WellnessHistorySheetProps) {
  const { icon: Icon, title, unit } = CONFIG[type];
  
  const getValue = (record: any): string | number => {
    if (type === 'sleep') return record.hours;
    if (type === 'stress') return record.level;
    if (type === 'dizziness') return record.severity;
    if (type === 'blood_pressure') return `${record.systolic}/${record.diastolic}`;
    return 0;
  };

  const getDate = (record: any) => {
    if (type === 'sleep') return record.date;
    return record.recorded_at;
  };

  // Calculate average - special handling for blood pressure (dual values)
  const getAverage = (): string => {
    if (data.length === 0) return type === 'blood_pressure' ? '0/0' : '0';
    
    if (type === 'blood_pressure') {
      const avgSystolic = Math.round(data.reduce((sum, r) => sum + r.systolic, 0) / data.length);
      const avgDiastolic = Math.round(data.reduce((sum, r) => sum + r.diastolic, 0) / data.length);
      return `${avgSystolic}/${avgDiastolic}`;
    }
    
    return (data.reduce((sum, r) => sum + getValue(r), 0) / data.length).toFixed(1);
  };

  const average = getAverage();
  const displayUnit = type === 'blood_pressure' ? ` ${unit}` : unit;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[70vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5 text-primary" />
            {title}
          </SheetTitle>
        </SheetHeader>

        <div className="mb-4 p-3 rounded-xl bg-secondary/30 text-center">
          <p className="text-hig-sm text-muted-foreground">Promedio 30 días</p>
          <p className="text-2xl font-semibold">{average}{displayUnit}</p>
        </div>

        <ScrollArea className="h-[calc(100%-120px)]">
          {data.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">Sin registros</p>
          ) : (
            <div className="space-y-2">
              {data.map((record, i) => (
                <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-muted/20">
                  <span className="text-hig-sm text-muted-foreground">
                    {format(new Date(getDate(record)), 'dd MMM', { locale: es })}
                  </span>
                  <span className="font-medium">{getValue(record)}{displayUnit}</span>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
