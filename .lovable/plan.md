

## Plan: Agregar Navegación Semanal al Historial de Sueño

### Problema Actual

El historial de sueño muestra únicamente los últimos 7 días de forma estática:
- No hay forma de ver semanas anteriores
- Las estadísticas son globales (30 días) pero el gráfico solo muestra 7 días fijos
- Inconsistente con la experiencia de glucometría que permite navegar entre semanas

---

### Solución Propuesta

Agregar navegación semanal con botones anterior/siguiente, siguiendo el patrón ya establecido en `WeeklyView.tsx` de glucometría.

---

### Diseño Visual Actualizado

```
┌─────────────────────────────────────────┐
│  🌙 Historial de Sueño                  │
├─────────────────────────────────────────┤
│                                         │
│  [<]   27 Ene - 2 Feb 2026   [>]       │  ← Nueva navegación
│           "Esta semana"                 │
│                                         │
│  ┌─────────────────────────────────┐    │
│  │     ██  ██████  ████  ████████  │    │  ← Gráfico de la semana seleccionada
│  │     Lu  Ma  Mi  Ju  Vi  Sa  Do  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │  ← Stats de la semana seleccionada
│  │  7.2h   │ │   8/10  │ │  1 día  │   │
│  │Promedio │ │ Calidad │ │ <6h ⚠️  │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│  Registros de esta semana               │  ← Lista filtrada por semana
│  ┌─────────────────────────────────┐    │
│  │ 02 Feb  │  8h  │ ██████████ 9/10│    │
│  │ 01 Feb  │  6h  │ ████████░░ 7/10│    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

### Cambios en SleepHistorySheet.tsx

**1. Agregar estado para semana seleccionada**

```tsx
const [selectedDate, setSelectedDate] = useState(new Date());

// Calcular inicio y fin de semana
const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
const weekEnd = endOfWeek(selectedDate, { weekStartsOn: 1 });
```

**2. Filtrar datos por semana seleccionada**

```tsx
const weekData = useMemo(() => {
  return data.filter(record => {
    const recordDate = new Date(record.date);
    return recordDate >= weekStart && recordDate <= weekEnd;
  });
}, [data, weekStart, weekEnd]);
```

**3. Agregar navegación de semana**

```tsx
// Handlers de navegación
const handlePrevWeek = () => {
  setSelectedDate(prev => subWeeks(prev, 1));
};

const handleNextWeek = () => {
  const nextWeek = addWeeks(selectedDate, 1);
  if (startOfWeek(nextWeek, { weekStartsOn: 1 }) <= new Date()) {
    setSelectedDate(nextWeek);
  }
};

const isCurrentWeek = isSameWeek(selectedDate, new Date(), { weekStartsOn: 1 });

// JSX de navegación
<div className="flex items-center justify-between px-2">
  <Button variant="ghost" size="icon" onClick={handlePrevWeek}>
    <ChevronLeft className="w-5 h-5" />
  </Button>
  
  <div className="text-center">
    <p className="font-medium text-sm">
      {format(weekStart, 'd MMM', { locale: es })} - {format(weekEnd, 'd MMM yyyy', { locale: es })}
    </p>
    {isCurrentWeek && (
      <span className="text-xs text-primary">Esta semana</span>
    )}
  </div>

  <Button 
    variant="ghost" 
    size="icon" 
    onClick={handleNextWeek}
    disabled={isCurrentWeek}
  >
    <ChevronRight className="w-5 h-5" />
  </Button>
</div>
```

**4. Actualizar cálculos de estadísticas**

Las estadísticas se calcularán sobre `weekData` (datos de la semana seleccionada):

```tsx
const stats = useMemo(() => {
  if (weekData.length === 0) return { avgHours: 0, avgQuality: 0, shortSleepDays: 0, ... };
  
  // Calcular sobre weekData en lugar de data completo
  const totalHours = weekData.reduce((sum, r) => sum + Number(r.hours), 0);
  // ...
}, [weekData]);
```

**5. Actualizar gráfico de barras**

```tsx
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
```

**6. Actualizar lista de registros**

```tsx
<div>
  <p className="text-xs text-muted-foreground mb-3">
    Registros de esta semana
  </p>
  {weekData.length === 0 ? (
    <p className="text-center text-muted-foreground py-8">
      Sin registros esta semana
    </p>
  ) : (
    <div className="space-y-2">
      {weekData.map((record, i) => (
        // ... renderizado existente
      ))}
    </div>
  )}
</div>
```

---

### Nuevas Imports Necesarias

```tsx
import { 
  startOfWeek, 
  endOfWeek, 
  subWeeks, 
  addWeeks, 
  eachDayOfInterval,
  isSameWeek 
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
```

---

### Resumen de Cambios

| Archivo | Cambios |
|---------|---------|
| `src/components/wellness/SleepHistorySheet.tsx` | Agregar navegación semanal, filtrar datos por semana, recalcular stats |

---

### Beneficios

| Aspecto | Antes | Después |
|---------|-------|---------|
| Navegación | Sin navegación | Anterior/Siguiente semana |
| Período visible | Últimos 7 días fijos | Cualquier semana histórica |
| Estadísticas | Globales (30 días) | Por semana seleccionada |
| Consistencia | Diferente a glucometría | Mismo patrón UX |
| Contexto temporal | Ambiguo | Claro con rango de fechas |

---

### Consideración Adicional

Se removerán las tarjetas de "Mejor noche" y "Peor noche" ya que en una vista semanal con pocos registros pierden relevancia. Se pueden mostrar solo cuando hay 3+ registros en la semana seleccionada.

