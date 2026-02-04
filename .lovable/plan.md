

## Plan Refinado: Implementar Métrica de Tensión Arterial

### Resumen Ejecutivo

Agregar seguimiento de presión arterial (sístole/diástole) a la sección "Bienestar Diario" del dashboard, siguiendo la arquitectura existente de wellness tracking y los hallazgos del QA técnico.

---

### Fase 1: Base de Datos

**Crear tabla `blood_pressure_records`**

```text
Columnas:
- id: uuid (PK, auto-generado)
- patient_id: uuid (NOT NULL)
- systolic: integer (NOT NULL, rango 60-250)
- diastolic: integer (NOT NULL, rango 40-150)
- pulse: integer (opcional, rango 40-200)
- position: text (opcional: 'sitting', 'standing', 'lying')
- arm: text (opcional: 'left', 'right')
- recorded_at: timestamptz (default now())
- notes: text (opcional)
- created_at: timestamptz (default now())

Índice: idx_blood_pressure_patient_date ON (patient_id, recorded_at DESC)

RLS Policies (patrón idéntico a stress_records):
- "Patients can manage own blood pressure records" (ALL)
- "Coadmins can view patient blood pressure records" (SELECT)
```

---

### Fase 2: Tipos TypeScript

**Archivo: `src/types/diabetes.ts`**

Agregar:

```text
// Nuevos tipos
type BloodPressurePosition = 'sitting' | 'standing' | 'lying';
type BloodPressureArm = 'left' | 'right';

// Interfaz del registro
interface BloodPressureRecord {
  id: string;
  patient_id: string;
  systolic: number;
  diastolic: number;
  pulse?: number;
  position?: BloodPressurePosition;
  arm?: BloodPressureArm;
  recorded_at: string;
  notes?: string;
}

// Clasificación clínica (American Heart Association)
type BloodPressureCategory = 
  | 'hypotension'    // < 90/60
  | 'normal'         // < 120/80
  | 'elevated'       // 120-129 / < 80
  | 'hypertension1'  // 130-139 / 80-89
  | 'hypertension2'  // 140-179 / 90-119
  | 'crisis';        // >= 180/120

// Constantes de rangos y labels en español
BLOOD_PRESSURE_LABELS: Record<BloodPressureCategory, string>
BLOOD_PRESSURE_COLORS: Record<BloodPressureCategory, string>
POSITION_LABELS: Record<BloodPressurePosition, string>
ARM_LABELS: Record<BloodPressureArm, string>

// Función helper
getBloodPressureCategory(systolic: number, diastolic: number): BloodPressureCategory
```

---

### Fase 3: Hook useWellnessLog

**Archivo: `src/hooks/useWellnessLog.ts`**

Cambios (hallazgo QA: seguir patrón exacto de stress/dizziness):

```text
// Nuevas interfaces
interface BloodPressureData {
  systolic: number;
  diastolic: number;
  pulse?: number;
  position?: BloodPressurePosition;
  arm?: BloodPressureArm;
  notes?: string;
}

interface TodayBloodPressureData {
  systolic: number;
  diastolic: number;
  pulse?: number;
}

// Nuevos queries
- todayBloodPressure: último registro del día actual
- bloodPressureHistory: registros de últimos 30 días

// Nueva mutation
- saveBloodPressureMutation: insertar nuevo registro

// Retorno actualizado
return {
  ...existing,
  todayBloodPressure,
  bloodPressureHistory,
  saveBloodPressure: saveBloodPressureMutation.mutate,
  // isLoading actualizado para incluir bloodPressureLoading
};
```

---

### Fase 4: Componente de Input

**Archivo: `src/components/daily-log/DailyLogInputDialog.tsx`**

Cambios (hallazgo QA: agregar tipo a union):

```text
// Actualizar tipo
type DailyLogType = 'glucose' | 'insulin' | 'sleep' | 'stress' | 'dizziness' | 'blood_pressure';

// Nueva interfaz de props
interface BloodPressureDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'blood_pressure';
  onSave: (data: BloodPressureData) => void;
  initialData?: { systolic: number; diastolic: number };
}

// Nuevo componente interno
BloodPressureContent:
- Dos inputs numéricos lado a lado (Sístole / Diástole)
- Input opcional para pulso
- Selector de posición con 3 opciones
- Selector de brazo con 2 opciones
- Indicador visual de clasificación (color según categoría)
- Campo de notas opcional
- Validación: sístole > diástole siempre
```

**Diseño del formulario:**
```text
┌─────────────────────────────────────┐
│  Registrar Tensión Arterial         │
├─────────────────────────────────────┤
│  ┌──────────┐    ┌──────────┐       │
│  │ Sístole  │ /  │ Diástole │ mmHg  │
│  │   120    │    │    80    │       │
│  └──────────┘    └──────────┘       │
│                                     │
│  [■ Normal] ← indicador color       │
│                                     │
│  Pulso (opcional): [72] bpm         │
│                                     │
│  Posición: [Sentado ▼]              │
│  Brazo:    [Izquierdo ▼]            │
│                                     │
│  Notas: [________________]          │
│                                     │
│         [Guardar]                   │
└─────────────────────────────────────┘
```

---

### Fase 5: HabitTrackerCard

**Archivo: `src/components/dashboard/HabitTrackerCard.tsx`**

Cambios (hallazgo QA: grid de 4 items):

```text
// Nuevo import
import { HeartPulse } from 'lucide-react';

// Nuevas props
interface HabitTrackerCardProps {
  ...existing,
  bloodPressureData?: { systolic: number; diastolic: number } | null;
  onBloodPressureClick?: () => void;
}

// Nuevo item en wellnessItems[]
{
  id: 'blood_pressure',
  icon: HeartPulse,
  label: 'Tensión',
  value: bloodPressureData ? `${systolic}/${diastolic}` : null,
  unit: 'mmHg',
  color: 'text-red-400',
  bgColor: 'bg-red-500/20',
  onClick: onBloodPressureClick
}

// Grid actualizado (de 3 a 4 columnas en desktop)
className="grid grid-cols-2 md:grid-cols-4 gap-3"
```

**Diseño visual del item:**
```text
┌─────────────────┐
│  ❤️ Tensión     │  ← HeartPulse icon (red-400)
│  120/80 mmHg    │  ← o "Toca para registrar"
│  [ver historial]│
└─────────────────┘
```

---

### Fase 6: WellnessHistorySheet

**Archivo: `src/components/wellness/WellnessHistorySheet.tsx`**

Cambios (hallazgo QA: formateo dual obligatorio):

```text
// Actualizar tipo
type WellnessType = 'sleep' | 'stress' | 'dizziness' | 'blood_pressure';

// Agregar a CONFIG
blood_pressure: { 
  icon: HeartPulse, 
  title: 'Historial de Tensión', 
  unit: 'mmHg' 
}

// Actualizar getValue (CRÍTICO - hallazgo QA)
const getValue = (record: any) => {
  if (type === 'sleep') return record.hours;
  if (type === 'stress') return record.level;
  if (type === 'dizziness') return record.severity;
  if (type === 'blood_pressure') return `${record.systolic}/${record.diastolic}`;
  return 0;
};

// Actualizar getDate
const getDate = (record: any) => {
  if (type === 'sleep') return record.date;
  return record.recorded_at; // stress, dizziness, blood_pressure usan recorded_at
};

// Promedio especial para tensión
const average = type === 'blood_pressure' 
  ? `${avgSystolic}/${avgDiastolic}`
  : regularAverage;
```

---

### Fase 7: Dashboard Integration

**Archivo: `src/pages/Dashboard.tsx`**

Cambios:

```text
// Nuevos estados
const [bloodPressureDialogOpen, setBloodPressureDialogOpen] = useState(false);

// Actualizar tipo historyType
type HistoryType = 'sleep' | 'stress' | 'dizziness' | 'blood_pressure' | null;

// Obtener datos del hook
const { 
  ...existing,
  todayBloodPressure,
  bloodPressureHistory,
  saveBloodPressure 
} = useWellnessLog(patientId);

// Pasar props a HabitTrackerCard
<HabitTrackerCard
  ...existing
  bloodPressureData={todayBloodPressure}
  onBloodPressureClick={() => setBloodPressureDialogOpen(true)}
  onBloodPressureHistoryClick={() => {
    setHistoryType('blood_pressure');
    setHistoryOpen(true);
  }}
/>

// Nuevo dialog
<DailyLogInputDialog
  open={bloodPressureDialogOpen}
  onOpenChange={setBloodPressureDialogOpen}
  type="blood_pressure"
  onSave={(data) => {
    saveBloodPressure(data);
    setBloodPressureDialogOpen(false);
    toast.success('Tensión arterial registrada');
  }}
/>

// WellnessHistorySheet ya soportará blood_pressure
```

---

### Resumen de Cambios

| Archivo | Tipo de Cambio |
|---------|----------------|
| Migración SQL | Crear tabla + índice + RLS |
| `src/types/diabetes.ts` | Agregar tipos e interfaces |
| `src/hooks/useWellnessLog.ts` | Agregar queries y mutation |
| `src/components/daily-log/DailyLogInputDialog.tsx` | Agregar BloodPressureContent |
| `src/components/dashboard/HabitTrackerCard.tsx` | Agregar 4to item + grid 4 cols |
| `src/components/wellness/WellnessHistorySheet.tsx` | Soportar formateo dual |
| `src/pages/Dashboard.tsx` | Integrar estados y handlers |

---

### Mitigación de Riesgos (del QA)

1. **Type Safety**: Todas las uniones de tipos actualizadas antes de implementar lógica
2. **Formateo Dual**: `getValue()` retorna string formateado para blood_pressure
3. **Grid Responsivo**: Testeado con 4 items en mobile (2x2) y desktop (1x4)
4. **RLS Consistente**: Políticas copiadas de `stress_records` (patrón probado)
5. **Validación**: sístole siempre > diástole enforced en UI

---

### Orden de Implementación

1. Migración SQL (tabla + políticas RLS)
2. Tipos en `diabetes.ts`
3. Hook `useWellnessLog.ts`
4. `DailyLogInputDialog.tsx` (BloodPressureContent)
5. `HabitTrackerCard.tsx` (nuevo item)
6. `WellnessHistorySheet.tsx` (soporte blood_pressure)
7. `Dashboard.tsx` (integración final)
8. Testing E2E

