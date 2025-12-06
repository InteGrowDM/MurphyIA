# Shaun Murphy IA - Especificación Técnica

## Descripción General

Shaun Murphy IA es el módulo de inteligencia artificial del sistema DiabetesManager Pro. Proporciona análisis predictivo, generación de alertas y reportes personalizados para pacientes diabéticos.

---

## Entradas (INPUTS)

### Datos de Glucometría
```typescript
interface GlucometryInput {
  patient_id: string;
  readings: {
    value: number;        // mg/dL (0-700)
    type: GlucometryType; // 'fasting' | 'preprandial' | 'postprandial' | 'random' | 'nocturnal'
    timestamp: string;    // ISO 8601
  }[];
  period: 'daily' | 'weekly' | 'monthly';
}
```

### Datos de Insulina
```typescript
interface InsulinInput {
  patient_id: string;
  doses: {
    units: number;
    type: InsulinType; // 'rapid' | 'short' | 'intermediate' | 'basal' | 'mixed'
    timestamp: string;
  }[];
}
```

### Datos de Sueño
```typescript
interface SleepInput {
  patient_id: string;
  records: {
    hours: number;   // 0-24
    quality: number; // 1-10
    date: string;
  }[];
}
```

### Datos de Estrés
```typescript
interface StressInput {
  patient_id: string;
  records: {
    level: number;    // 1-10
    timestamp: string;
  }[];
}
```

### Metadata del Paciente
```typescript
interface PatientMetadata {
  patient_id: string;
  diabetes_type: DiabetesType;
  age: number;
  estrato: number;
  medications: string[];
  comorbidities: string[];
  target_range: {
    min: number; // default: 70
    max: number; // default: 180
  };
}
```

---

## Salidas (OUTPUTS)

### Alertas JSON
```typescript
interface AlertOutput {
  id: string;
  patient_id: string;
  type: AlertType;
  severity: 'info' | 'warning' | 'critical';
  message: string;
  timestamp: string;
  data: {
    trigger_value?: number;
    threshold?: number;
    pattern?: string;
  };
  recommended_actions: string[];
}
```

#### Tipos de Alertas Generadas

| Tipo | Trigger | Severidad |
|------|---------|-----------|
| hypoglycemia | value < 70 mg/dL | critical |
| hyperglycemia | value > 250 mg/dL | critical |
| hyperglycemia | value > 180 mg/dL | warning |
| nocturnal_hypo | value < 70 entre 00:00-06:00 | critical |
| pattern_detected | 3+ eventos similares en 7 días | warning |
| missed_dose | Sin registro insulina > 12hrs | warning |
| poor_sleep | quality < 5 por 3+ días | info |
| high_stress | level > 7 por 3+ días | info |

### Reporte Resumen JSON
```typescript
interface ReportSummary {
  patient_id: string;
  generated_at: string;
  period: {
    start: string;
    end: string;
  };
  metrics: {
    avg_glucose: number;
    std_dev: number;
    hypo_count: number;        // < 70 mg/dL
    hyper_count: number;       // > 180 mg/dL
    time_in_range: number;     // % entre 70-180
    time_below_range: number;  // % < 70
    time_above_range: number;  // % > 180
    gmi: number;               // Glucose Management Indicator
    cv: number;                // Coefficient of Variation
  };
  trend: 'improving' | 'stable' | 'deteriorating';
  patterns: {
    type: string;
    description: string;
    frequency: number;
    times: string[]; // horarios frecuentes
  }[];
  correlations: {
    sleep_glucose: number;   // -1 to 1
    stress_glucose: number;  // -1 to 1
    insulin_efficacy: number;
  };
}
```

### Recomendaciones
```typescript
interface Recommendations {
  patient_id: string;
  items: {
    priority: 'high' | 'medium' | 'low';
    category: 'medication' | 'lifestyle' | 'monitoring' | 'diet';
    title: string;
    description: string;
    evidence: string;
  }[];
}
```

### Reporte PDF (Opcional)
```typescript
interface PDFReport {
  patient_id: string;
  generated_at: string;
  pdf_url: string; // URL de Supabase Storage
  expires_at: string;
}
```

---

## Flujos de Procesamiento

### 1. Análisis en Tiempo Real (On Insert)

```
Nuevo registro glucometría
        ↓
   Edge Function: analyze-glucose
        ↓
   ¿Valor fuera de rango crítico?
        ↓
   SÍ → Generar alerta crítica
        → Notificar paciente (push + Telegram)
        → Notificar coadmin (si existe)
        → Notificar médico (si configurado)
        ↓
   NO → Agregar a buffer de análisis
```

### 2. Análisis Batch (Diario - 06:00 UTC)

```
Cron Job: daily-analysis
        ↓
   Para cada paciente activo:
        ↓
   1. Recopilar datos últimas 24hrs
   2. Calcular métricas
   3. Detectar patrones
   4. Generar alertas de patrón
   5. Actualizar tendencia
   6. Generar reporte si es lunes
        ↓
   Guardar en ai_reports
        ↓
   ¿Alertas críticas?
        → Notificar médico vía CRM
```

### 3. Generación de Reporte Semanal

```
Cron Job: weekly-report (Lunes 07:00 UTC)
        ↓
   Para cada paciente:
        ↓
   1. Agregar datos semana
   2. Calcular métricas TIR, GMI, CV
   3. Identificar correlaciones
   4. Generar recomendaciones
   5. Crear PDF (opcional)
        ↓
   Guardar reporte
        ↓
   Notificar paciente
```

---

## Configuración de Edge Functions

### `analyze-glucose`
- **Trigger**: INSERT en `glucometrias`
- **Timeout**: 10s
- **Memoria**: 256MB

### `daily-analysis`
- **Trigger**: Cron `0 6 * * *`
- **Timeout**: 300s
- **Memoria**: 512MB

### `generate-report`
- **Trigger**: HTTP POST o Cron semanal
- **Timeout**: 120s
- **Memoria**: 512MB

---

## Modelo de IA

### Opciones de Implementación

1. **Lovable AI Gateway** (Recomendado para MVP)
   - Modelo: `google/gemini-2.5-flash`
   - Ventaja: Sin configuración de API keys
   - Uso: Análisis de patrones y generación de texto

2. **Reglas Heurísticas** (Para alertas críticas)
   - Sin dependencia de IA externa
   - Respuesta inmediata < 100ms
   - Ejemplo: `if (glucose < 70) alert('hypoglycemia', 'critical')`

### Prompt Template para Análisis

```
Eres Shaun Murphy, un asistente médico especializado en diabetes.
Analiza los siguientes datos del paciente y proporciona insights.

DATOS DEL PACIENTE:
- Tipo de diabetes: {diabetes_type}
- Edad: {age} años
- Glucometrías últimas 24h: {readings}
- Insulina administrada: {insulin}
- Calidad de sueño: {sleep}
- Nivel de estrés: {stress}

INSTRUCCIONES:
1. Identifica patrones anormales
2. Correlaciona factores (sueño, estrés, comidas)
3. Genera recomendaciones accionables
4. Prioriza por urgencia médica

FORMATO DE RESPUESTA:
{
  "patterns": [...],
  "correlations": {...},
  "recommendations": [...],
  "alerts": [...]
}
```

---

## Integraciones

### Telegram Bot

```typescript
// Notificación de alerta crítica
await sendTelegramMessage(patient.telegram_id, {
  text: `⚠️ ALERTA: ${alert.message}`,
  parse_mode: 'Markdown',
  reply_markup: {
    inline_keyboard: [[
      { text: '✅ Atendido', callback_data: `resolve_${alert.id}` },
      { text: '📞 Contactar médico', callback_data: `contact_doctor` }
    ]]
  }
});
```

### CRM Médico

```typescript
// Priorización automática
interface CRMPriority {
  patient_id: string;
  priority_score: number; // 0-100
  factors: {
    critical_alerts: number;
    trend: 'improving' | 'stable' | 'deteriorating';
    days_since_contact: number;
    adherence_score: number;
  };
  suggested_actions: string[];
}
```

---

## Métricas de Monitoreo

| Métrica | Descripción | Umbral Alerta |
|---------|-------------|---------------|
| alert_response_time | Tiempo desde lectura hasta alerta | > 5s |
| daily_analysis_duration | Duración del batch diario | > 5min |
| false_positive_rate | Alertas incorrectas / total | > 10% |
| ai_api_errors | Errores de Lovable AI Gateway | > 1% |

---

## Consideraciones de Privacidad

1. **Datos mínimos**: Solo enviar datos necesarios a la IA
2. **Sin PII en prompts**: No incluir nombres ni identificadores
3. **Logs sanitizados**: Remover datos sensibles de logs
4. **Retención**: Reportes PDF expiran en 30 días
5. **Consentimiento**: Requerido para análisis de IA
