import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { GlucoseSlotCard } from '@/components/glucose/GlucoseSlotCard';
import { GlucoseInputDialog } from '@/components/glucose/GlucoseInputDialog';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useGlucoseLog } from '@/hooks/useGlucoseLog';
import { 
  Glucometry, 
  GlucometryType, 
  MEAL_TIME_SLOTS, 
  Patient,
  UserRole 
} from '@/types/diabetes';
import { cn } from '@/lib/utils';
import { format, isSameDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Share2, TrendingUp, Activity } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import mockData from '@/data/mockPatients.json';

export default function Glucometrias() {
  const location = useLocation();
  const userRole = (location.state?.role as UserRole) || 'patient';
  
  const patients = mockData.patients as Patient[];
  const currentPatient = patients[0];
  const userName = userRole === 'coadmin' 
    ? mockData.coadmins[0].name 
    : currentPatient.name;

  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<'daily' | 'monthly'>('daily');
  const [selectedSlot, setSelectedSlot] = useState<{
    type: GlucometryType;
    record?: Glucometry;
  } | null>(null);

  // Initialize hook with existing patient data
  const { 
    records, 
    addRecord, 
    updateRecord, 
    getRecordsByDate 
  } = useGlucoseLog(currentPatient.glucometrias);

  // Get records for selected date
  const dayRecords = useMemo(() => {
    return getRecordsByDate(selectedDate);
  }, [selectedDate, getRecordsByDate]);

  const isToday = isSameDay(selectedDate, new Date());

  const handleSlotClick = (type: GlucometryType, record?: Glucometry) => {
    setSelectedSlot({ type, record });
  };

  const handleSaveRecord = (value: number, notes?: string) => {
    if (!selectedSlot) return;

    if (selectedSlot.record) {
      updateRecord(selectedSlot.record.id, value, notes);
    } else {
      addRecord(selectedSlot.type, value, notes);
    }
    setSelectedSlot(null);
  };

  // Calculate daily stats
  const stats = useMemo(() => {
    const values = Array.from(dayRecords.values()).map(r => r.value);
    if (values.length === 0) return null;
    
    return {
      count: values.length,
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      min: Math.min(...values),
      max: Math.max(...values),
      inRange: values.filter(v => v >= 70 && v <= 180).length,
    };
  }, [dayRecords]);

  return (
    <DashboardLayout userRole={userRole} userName={userName}>
      {/* Page Header */}
      <header className="mb-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-hig-2xl md:text-hig-3xl font-bold text-foreground mb-1 leading-hig-tight">
              Glucometrías
            </h1>
            <p className="text-muted-foreground text-hig-base leading-hig-normal">
              Historial de registros de glucosa
            </p>
          </div>
          <Button
            variant="outline"
            size="icon"
            className="w-10 h-10"
            aria-label="Compartir registros"
          >
            <Share2 className="w-[var(--icon-md)] h-[var(--icon-md)]" />
          </Button>
        </div>
      </header>

      {/* Date Picker & View Toggle */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant="outline"
              className={cn(
                "justify-start text-left font-normal h-12 px-4 flex-1",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              <span className="capitalize">
                {format(selectedDate, "EEEE, d 'de' MMMM yyyy", { locale: es })}
              </span>
              {isToday && (
                <span className="ml-2 text-hig-xs text-primary bg-primary/20 px-2 py-0.5 rounded-full">
                  Hoy
                </span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={(date) => date && setSelectedDate(date)}
              disabled={(date) => date > new Date()}
              initialFocus
              className="pointer-events-auto"
            />
          </PopoverContent>
        </Popover>

        <div className="flex rounded-hig border border-border/50 overflow-hidden">
          <button
            onClick={() => setViewMode('daily')}
            className={cn(
              "px-4 py-2 text-hig-sm font-medium transition-colors min-w-[80px]",
              viewMode === 'daily' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
            )}
          >
            Diario
          </button>
          <button
            onClick={() => setViewMode('monthly')}
            className={cn(
              "px-4 py-2 text-hig-sm font-medium transition-colors min-w-[80px]",
              viewMode === 'monthly' 
                ? "bg-primary text-primary-foreground" 
                : "bg-secondary/30 text-muted-foreground hover:bg-secondary/50"
            )}
          >
            Mensual
          </button>
        </div>
      </div>

      {/* Daily Stats */}
      {stats && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <article className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <Activity className="w-4 h-4 text-primary" />
              <span className="text-hig-xs text-muted-foreground">Registros</span>
            </div>
            <p className="text-hig-xl font-bold text-foreground">{stats.count}/6</p>
          </article>
          <article className="glass-card p-4">
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="w-4 h-4 text-info" />
              <span className="text-hig-xs text-muted-foreground">Promedio</span>
            </div>
            <p className="text-hig-xl font-bold text-foreground">{stats.avg} <span className="text-hig-xs font-normal text-muted-foreground">mg/dL</span></p>
          </article>
          <article className="glass-card p-4">
            <span className="text-hig-xs text-muted-foreground">Mínimo</span>
            <p className="text-hig-xl font-bold text-warning">{stats.min} <span className="text-hig-xs font-normal text-muted-foreground">mg/dL</span></p>
          </article>
          <article className="glass-card p-4">
            <span className="text-hig-xs text-muted-foreground">Máximo</span>
            <p className="text-hig-xl font-bold text-destructive">{stats.max} <span className="text-hig-xs font-normal text-muted-foreground">mg/dL</span></p>
          </article>
        </div>
      )}

      {/* Daily View */}
      {viewMode === 'daily' && (
        <section className="space-y-3">
          <h2 className="text-hig-base font-semibold text-foreground mb-4">
            Registros del día
          </h2>
          
          {MEAL_TIME_SLOTS.map((slot, index) => (
            <div 
              key={slot.type}
              className="animate-fade-up"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <GlucoseSlotCard
                type={slot.type}
                record={dayRecords.get(slot.type)}
                iconName={slot.icon}
                onClick={() => handleSlotClick(slot.type, dayRecords.get(slot.type))}
              />
            </div>
          ))}

          {dayRecords.size === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto rounded-full bg-muted/20 flex items-center justify-center mb-4">
                <Activity className="w-8 h-8 text-muted-foreground" />
              </div>
              <p className="text-foreground font-medium">Sin registros este día</p>
              <p className="text-hig-sm text-muted-foreground mt-1">
                {isToday 
                  ? 'Toca cualquier momento para agregar un registro'
                  : 'No hay registros para esta fecha'
                }
              </p>
            </div>
          )}
        </section>
      )}

      {/* Monthly View Placeholder */}
      {viewMode === 'monthly' && (
        <section className="glass-card p-8 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center mb-4">
            <CalendarIcon className="w-8 h-8 text-primary" />
          </div>
          <h3 className="text-foreground font-semibold text-hig-lg mb-2">Vista Mensual</h3>
          <p className="text-muted-foreground text-hig-sm max-w-md mx-auto">
            Próximamente podrás ver un resumen mensual con calendario y estadísticas de tendencia.
          </p>
        </section>
      )}

      {/* Input Dialog */}
      {selectedSlot && (
        <GlucoseInputDialog
          open={!!selectedSlot}
          onOpenChange={(open) => !open && setSelectedSlot(null)}
          type={selectedSlot.type}
          initialValue={selectedSlot.record?.value}
          onSave={handleSaveRecord}
        />
      )}
    </DashboardLayout>
  );
}
