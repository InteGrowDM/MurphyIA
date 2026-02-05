

## Plan: Mejorar Vista del Historial de Sueño

### Problema Actual

La vista de historial de sueño es muy básica:
- Solo muestra una lista simple con fecha y horas
- No muestra la calidad del sueño (dato disponible en la base de datos)
- No hay visualización gráfica de tendencias
- Sin estadísticas adicionales como mejor noche, peor noche, etc.

---

### Solución Propuesta

Crear un componente especializado `SleepHistorySheet` con visualización enriquecida que incluya:

1. **Gráfico de barras de horas dormidas** (últimos 7-14 días)
2. **Indicador visual de calidad** por cada registro
3. **Estadísticas adicionales** (mejor noche, peor noche, días bajo 6h)
4. **Lista detallada** con horas + calidad combinadas

---

### Diseño Visual

```
┌─────────────────────────────────────────┐
│  🌙 Historial de Sueño                  │
├─────────────────────────────────────────┤
│  ┌─────────────────────────────────┐    │
│  │     Gráfico de barras           │    │
│  │     ██  ██████  ████  ████████  │    │
│  │     Lu  Ma  Mi  Ju  Vi  Sa  Do  │    │
│  └─────────────────────────────────┘    │
│                                         │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐   │
│  │  7.2h   │ │   8/10  │ │  3 días │   │
│  │Promedio │ │ Calidad │ │ <6h ⚠️  │   │
│  └─────────┘ └─────────┘ └─────────┘   │
│                                         │
│  Últimos registros                      │
│  ┌─────────────────────────────────┐    │
│  │ 04 Feb  │  8h  │ ██████████ 9/10│    │
│  │ 03 Feb  │  6h  │ ████████░░ 7/10│    │
│  │ 02 Feb  │  5h  │ █████░░░░░ 5/10│    │
│  └─────────────────────────────────┘    │
└─────────────────────────────────────────┘
```

---

### Fase 1: Crear Componente SleepHistorySheet

**Nuevo archivo: `src/components/wellness/SleepHistorySheet.tsx`**

Componente especializado con:

```text
// Estadísticas calculadas
- Promedio de horas (últimos 30 días)
- Promedio de calidad (1-10)
- Días con menos de 6h (indicador de alerta)
- Mejor noche (más horas + calidad)
- Peor noche (menos horas + calidad baja)

// Mini gráfico de barras (últimos 7 días)
- Barras verticales representando horas
- Color según calidad:
  - Excelente (8-10): verde/success
  - Bueno (6-7): azul/primary  
  - Regular (4-5): amarillo/warning
  - Malo (1-3): rojo/destructive

// Lista detallada
- Fecha formateada
- Horas dormidas
- Barra visual de calidad (10 segmentos)
- Etiqueta de calidad (Malo/Regular/Bueno/Excelente)
```

---

### Fase 2: Refactorizar WellnessHistorySheet

**Archivo: `src/components/wellness/WellnessHistorySheet.tsx`**

Cambios:
- Renderizar `SleepHistorySheet` cuando `type === 'sleep'`
- Mantener la vista genérica para stress, dizziness, blood_pressure

```tsx
// Detección de tipo especializado
if (type === 'sleep') {
  return <SleepHistorySheet open={open} onOpenChange={onOpenChange} data={data} />;
}

// Resto de tipos usan la vista genérica actual
return <GenericWellnessHistorySheet ... />;
```

---

### Fase 3: Componentes Visuales

**Mini Chart de Barras (últimos 7 días)**

```tsx
// Componente simple sin Recharts para mantener ligereza
<div className="flex items-end justify-between gap-1 h-24">
  {last7Days.map(day => (
    <div key={day.date} className="flex flex-col items-center gap-1 flex-1">
      <div 
        className="w-full rounded-t-sm transition-all"
        style={{ 
          height: `${(day.hours / 12) * 100}%`,
          backgroundColor: getQualityColor(day.quality)
        }}
      />
      <span className="text-xs text-muted-foreground">{day.dayLabel}</span>
    </div>
  ))}
</div>
```

**Barra de Calidad por Registro**

```tsx
<div className="flex gap-0.5">
  {[...Array(10)].map((_, i) => (
    <div 
      key={i}
      className={cn(
        "w-2 h-3 rounded-sm",
        i < quality ? getQualityColor(quality) : "bg-muted/30"
      )}
    />
  ))}
</div>
```

---

### Fase 4: Helpers y Constantes

**Constantes de calidad de sueño:**

```tsx
const SLEEP_QUALITY_LABELS = {
  excellent: 'Excelente',  // 8-10
  good: 'Bueno',           // 6-7
  fair: 'Regular',         // 4-5
  poor: 'Malo',            // 1-3
};

const SLEEP_QUALITY_COLORS = {
  excellent: 'bg-success text-success',
  good: 'bg-primary text-primary',
  fair: 'bg-warning text-warning',
  poor: 'bg-destructive text-destructive',
};

function getSleepQualityCategory(quality: number) {
  if (quality >= 8) return 'excellent';
  if (quality >= 6) return 'good';
  if (quality >= 4) return 'fair';
  return 'poor';
}
```

---

### Resumen de Cambios

| Archivo | Tipo de Cambio |
|---------|----------------|
| `src/components/wellness/SleepHistorySheet.tsx` | **Crear** - Componente especializado |
| `src/components/wellness/WellnessHistorySheet.tsx` | Modificar - Delegar a especializado cuando type='sleep' |

---

### Beneficios

| Aspecto | Antes | Después |
|---------|-------|---------|
| Datos mostrados | Solo horas | Horas + Calidad visual |
| Visualización | Lista simple | Gráfico + Lista enriquecida |
| Estadísticas | Solo promedio | Promedio, alertas, tendencia |
| Contexto | Mínimo | Indicadores de calidad codificados por color |
| UX | Básica | Informativa y accionable |

---

### Notas Técnicas

1. **No requiere Recharts adicional** - El mini gráfico usa divs con CSS para mantener el bundle ligero
2. **Responsive** - Diseño adaptable a mobile y desktop
3. **Accesibilidad** - Colores con suficiente contraste, aria-labels en elementos interactivos
4. **Performance** - Cálculos con useMemo para evitar re-renders innecesarios

