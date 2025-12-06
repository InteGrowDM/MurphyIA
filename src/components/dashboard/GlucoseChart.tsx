import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, Area, ComposedChart } from 'recharts';
import { Glucometry } from '@/types/diabetes';
import { cn } from '@/lib/utils';

interface GlucoseChartProps {
  data: Glucometry[];
  showTargetRange?: boolean;
  className?: string;
}

export function GlucoseChart({ data, showTargetRange = true, className }: GlucoseChartProps) {
  const chartData = useMemo(() => {
    return [...data]
      .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime())
      .map(reading => ({
        ...reading,
        time: new Date(reading.timestamp).toLocaleTimeString('es-ES', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        date: new Date(reading.timestamp).toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'short'
        }),
        inRange: reading.value >= 70 && reading.value <= 180,
      }));
  }, [data]);

  const stats = useMemo(() => {
    if (data.length === 0) return { avg: 0, min: 0, max: 0, inRange: 0 };
    const values = data.map(d => d.value);
    const inRangeCount = values.filter(v => v >= 70 && v <= 180).length;
    return {
      avg: Math.round(values.reduce((a, b) => a + b, 0) / values.length),
      min: Math.min(...values),
      max: Math.max(...values),
      inRange: Math.round((inRangeCount / values.length) * 100),
    };
  }, [data]);

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const isHigh = data.value > 180;
      const isLow = data.value < 70;
      
      return (
        <div className="glass-card p-3 border border-border/50">
          <p className="text-xs text-muted-foreground mb-1">{data.date} - {data.time}</p>
          <p className={cn(
            "text-lg font-bold",
            isHigh ? "text-destructive" : isLow ? "text-warning" : "text-success"
          )}>
            {data.value} mg/dL
          </p>
          <p className="text-xs text-muted-foreground capitalize">{data.type}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className={cn("glass-card glow-border p-5 animate-fade-up", className)}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold text-lg text-foreground">Tendencia Glucémica</h3>
        <div className="flex items-center gap-4">
          {showTargetRange && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-success/50" />
              <span className="text-xs text-muted-foreground">70-180 mg/dL</span>
            </div>
          )}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <div className="text-center p-2 rounded-lg bg-secondary/30">
          <p className="text-2xl font-bold text-foreground">{stats.avg}</p>
          <p className="text-xs text-muted-foreground">Promedio</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-secondary/30">
          <p className="text-2xl font-bold text-warning">{stats.min}</p>
          <p className="text-xs text-muted-foreground">Mínimo</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-secondary/30">
          <p className="text-2xl font-bold text-destructive">{stats.max}</p>
          <p className="text-xs text-muted-foreground">Máximo</p>
        </div>
        <div className="text-center p-2 rounded-lg bg-secondary/30">
          <p className="text-2xl font-bold text-success">{stats.inRange}%</p>
          <p className="text-xs text-muted-foreground">En rango</p>
        </div>
      </div>

      {/* Chart */}
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="glucoseGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(273, 100%, 71%)" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="hsl(273, 100%, 71%)" stopOpacity={0}/>
              </linearGradient>
            </defs>
            
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="hsl(275, 40%, 18%)" 
              vertical={false}
            />
            
            {showTargetRange && (
              <>
                <ReferenceLine 
                  y={180} 
                  stroke="hsl(0, 84%, 60%)" 
                  strokeDasharray="5 5" 
                  strokeOpacity={0.5}
                />
                <ReferenceLine 
                  y={70} 
                  stroke="hsl(38, 92%, 50%)" 
                  strokeDasharray="5 5" 
                  strokeOpacity={0.5}
                />
              </>
            )}
            
            <XAxis 
              dataKey="time" 
              tick={{ fill: 'hsl(275, 20%, 60%)', fontSize: 11 }}
              tickLine={{ stroke: 'hsl(275, 40%, 18%)' }}
              axisLine={{ stroke: 'hsl(275, 40%, 18%)' }}
            />
            
            <YAxis 
              domain={[40, 300]}
              tick={{ fill: 'hsl(275, 20%, 60%)', fontSize: 11 }}
              tickLine={{ stroke: 'hsl(275, 40%, 18%)' }}
              axisLine={{ stroke: 'hsl(275, 40%, 18%)' }}
            />
            
            <Tooltip content={<CustomTooltip />} />
            
            <Area
              type="monotone"
              dataKey="value"
              stroke="transparent"
              fill="url(#glucoseGradient)"
            />
            
            <Line
              type="monotone"
              dataKey="value"
              stroke="hsl(273, 100%, 71%)"
              strokeWidth={3}
              dot={(props: any) => {
                const { cx, cy, payload } = props;
                const isHigh = payload.value > 180;
                const isLow = payload.value < 70;
                const color = isHigh ? 'hsl(0, 84%, 60%)' : isLow ? 'hsl(38, 92%, 50%)' : 'hsl(273, 100%, 71%)';
                
                return (
                  <circle 
                    cx={cx} 
                    cy={cy} 
                    r={5} 
                    fill={color}
                    stroke="hsl(275, 85%, 4%)"
                    strokeWidth={2}
                    style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                  />
                );
              }}
              activeDot={{
                r: 8,
                fill: 'hsl(273, 100%, 71%)',
                stroke: 'hsl(275, 85%, 4%)',
                strokeWidth: 2,
                style: { filter: 'drop-shadow(0 0 8px hsl(273, 100%, 71%))' }
              }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
