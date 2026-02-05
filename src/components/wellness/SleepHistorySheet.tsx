import { useMemo, useState } from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Moon, AlertTriangle, TrendingUp, Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameWeek, addWeeks, subWeeks } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface SleepRecord {
  date: string;
  hours: number;
  quality: number;
}

interface SleepHistorySheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: SleepRecord[];
}

type QualityCategory = 'excellent' | 'good' | 'fair' | 'poor';

const QUALITY_CONFIG: Record<QualityCategory, { label: string; bgClass: string; textClass: string }> = {
  excellent: { label: 'Excelente', bgClass: 'bg-emerald-500', textClass: 'text-emerald-500' },
  good: { label: 'Bueno', bgClass: 'bg-primary', textClass: 'text-primary' },
  fair: { label: 'Regular', bgClass: 'bg-amber-500', textClass: 'text-amber-500' },
  poor: { label: 'Malo', bgClass: 'bg-destructive', textClass: 'text-destructive' },
};

function getQualityCategory(quality: number): QualityCategory {
  if (quality >= 8) return 'excellent';
  if (quality >= 6) return 'good';
  if (quality >= 4) return 'fair';
  return 'poor';
}

function getQualityBgClass(quality: number): string {
  return QUALITY_CONFIG[getQualityCategory(quality)].bgClass;
}

export function SleepHistorySheet({ open, onOpenChange, data }: SleepHistorySheetProps) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  
  const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
  const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
  const isCurrentWeek = isSameWeek(selectedDate, new Date(), { weekStartsOn: 1 });

  // Filter data for selected week
  const weekData = useMemo(() => {
    return data.filter(record => {
      const recordDate = new Date(record.date);
      return recordDate >= weekStart && recordDate <= weekEnd;
    });
  }, [data, weekStart, weekEnd]);

  // Calculate statistics for selected week
  const stats = useMemo(() => {
    if (weekData.length === 0) {
      return {
        avgHours: 0,
        avgQuality: 0,
        shortSleepDays: 0,
        bestNight: null as SleepRecord | null,
        worstNight: null as SleepRecord | null,
      };
    }

    const totalHours = weekData.reduce((sum, r) => sum + Number(r.hours), 0);
    const totalQuality = weekData.reduce((sum, r) => sum + r.quality, 0);
    const shortSleepDays = weekData.filter(r => Number(r.hours) < 6).length;

    // Best night = highest hours + quality combined
    const sortedByScore = [...weekData].sort((a, b) => {
      const scoreA = Number(a.hours) + a.quality;
      const scoreB = Number(b.hours) + b.quality;
      return scoreB - scoreA;
    });

    return {
      avgHours: totalHours / weekData.length,
      avgQuality: totalQuality / weekData.length,
      shortSleepDays,
      bestNight: sortedByScore[0] || null,
      worstNight: sortedByScore[sortedByScore.length - 1] || null,
    };
  }, [weekData]);

  // Get days for selected week
  const weekDays = useMemo(() => {
    return eachDayOfInterval({ start: weekStart, end: weekEnd }).map(date => {
      const dateStr = format(date, 'yyyy-MM-dd');
      const record = data.find(r => r.date === dateStr);
      return {
        date: dateStr,
        dayLabel: format(date, 'EEE', { locale: es }).slice(0, 2),
        hours: record ? Number(record.hours) : null,
        quality: record ? record.quality : null,
      };
    });
  }, [weekStart, weekEnd, data]);

  const handlePrevWeek = () => {
    setSelectedDate(prev => subWeeks(prev, 1));
  };

  const handleNextWeek = () => {
    const nextWeek = addWeeks(selectedDate, 1);
    if (startOfWeek(nextWeek, { weekStartsOn: 1 }) <= new Date()) {
      setSelectedDate(nextWeek);
    }
  };

  const avgQualityCategory = getQualityCategory(Math.round(stats.avgQuality));
  const periodLabel = `${format(weekStart, 'd MMM', { locale: es })} - ${format(weekEnd, 'd MMM yyyy', { locale: es })}`;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="h-[85vh] rounded-t-3xl">
        <SheetHeader className="pb-4">
          <SheetTitle className="flex items-center gap-2">
            <Moon className="w-5 h-5 text-primary" />
            Historial de Sueño
          </SheetTitle>
        </SheetHeader>

        <ScrollArea className="h-[calc(100%-60px)]">
          <div className="space-y-6 pb-6">
            {/* Week Navigation */}
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="icon"
                onClick={handlePrevWeek}
                aria-label="Semana anterior"
              >
                <ChevronLeft className="w-5 h-5" />
              </Button>
              
              <div className="text-center">
                <p className="text-sm font-semibold text-foreground capitalize">
                  {periodLabel}
                </p>
                {isCurrentWeek && (
                  <span className="text-xs text-primary">Esta semana</span>
                )}
              </div>

              <Button
                variant="outline"
                size="icon"
                onClick={handleNextWeek}
                disabled={isCurrentWeek}
                aria-label="Semana siguiente"
              >
                <ChevronRight className="w-5 h-5" />
              </Button>
            </div>

            {/* Mini Bar Chart - Selected week */}
            <div className="p-4 rounded-xl bg-secondary/30">
              <p className="text-xs text-muted-foreground mb-3 text-center">Horas de sueño</p>
              <div className="flex items-end justify-between gap-1.5 h-24">
                {weekDays.map((day) => (
                  <div key={day.date} className="flex flex-col items-center gap-1.5 flex-1">
                    {day.hours !== null ? (
                      <div
                        className={cn(
                          "w-full rounded-t-sm transition-all min-h-[4px]",
                          getQualityBgClass(day.quality || 5)
                        )}
                        style={{ height: `${Math.max((day.hours / 12) * 100, 5)}%` }}
                        title={`${day.hours}h - Calidad: ${day.quality}/10`}
                      />
                    ) : (
                      <div className="w-full h-1 bg-muted/30 rounded-t-sm" />
                    )}
                    <span className="text-[10px] text-muted-foreground uppercase">{day.dayLabel}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics Grid */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-3 rounded-xl bg-secondary/30 text-center">
                <p className="text-xl font-semibold">{stats.avgHours.toFixed(1)}h</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Promedio</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/30 text-center">
                <p className={cn("text-xl font-semibold", QUALITY_CONFIG[avgQualityCategory].textClass)}>
                  {stats.avgQuality.toFixed(1)}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Calidad</p>
              </div>
              <div className="p-3 rounded-xl bg-secondary/30 text-center">
                <p className={cn(
                  "text-xl font-semibold",
                  stats.shortSleepDays > 0 ? "text-amber-500" : "text-emerald-500"
                )}>
                  {stats.shortSleepDays}
                </p>
                <p className="text-[10px] text-muted-foreground mt-0.5 flex items-center justify-center gap-0.5">
                  {stats.shortSleepDays > 0 && <AlertTriangle className="w-2.5 h-2.5" />}
                  &lt;6h
                </p>
              </div>
            </div>

            {/* Best & Worst Night - Only show with 3+ records */}
            {(stats.bestNight || stats.worstNight) && weekData.length >= 3 && (
              <div className="grid grid-cols-2 gap-2">
                {stats.bestNight && (
                  <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Star className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-[10px] text-emerald-500 font-medium">Mejor noche</span>
                    </div>
                    <p className="text-sm font-medium">{Number(stats.bestNight.hours)}h · {stats.bestNight.quality}/10</p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(stats.bestNight.date), 'dd MMM', { locale: es })}
                    </p>
                  </div>
                )}
                {stats.worstNight && stats.worstNight !== stats.bestNight && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/20">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp className="w-3.5 h-3.5 text-destructive rotate-180" />
                      <span className="text-[10px] text-destructive font-medium">A mejorar</span>
                    </div>
                    <p className="text-sm font-medium">{Number(stats.worstNight.hours)}h · {stats.worstNight.quality}/10</p>
                    <p className="text-[10px] text-muted-foreground">
                      {format(new Date(stats.worstNight.date), 'dd MMM', { locale: es })}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Detailed List */}
            <div>
              <p className="text-xs text-muted-foreground mb-3">Registros de esta semana</p>
              {weekData.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">Sin registros esta semana</p>
              ) : (
                <div className="space-y-2">
                  {weekData.map((record, i) => {
                    const category = getQualityCategory(record.quality);
                    const config = QUALITY_CONFIG[category];
                    
                    return (
                      <div 
                        key={i} 
                        className="flex items-center justify-between p-3 rounded-xl bg-muted/20"
                      >
                        <div className="flex items-center gap-3">
                          <span className="text-xs text-muted-foreground w-14">
                            {format(new Date(record.date), 'dd MMM', { locale: es })}
                          </span>
                          <span className="font-medium text-sm">{Number(record.hours)}h</span>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Quality bar visualization */}
                          <div className="flex gap-0.5">
                            {[...Array(10)].map((_, idx) => (
                              <div
                                key={idx}
                                className={cn(
                                  "w-1.5 h-3 rounded-sm transition-colors",
                                  idx < record.quality ? config.bgClass : "bg-muted/30"
                                )}
                              />
                            ))}
                          </div>
                          <span className={cn("text-xs font-medium min-w-[60px] text-right", config.textClass)}>
                            {config.label}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}
