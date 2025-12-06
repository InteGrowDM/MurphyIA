# DiabetesManager Pro

Dashboard inteligente para seguimiento de pacientes diabéticos con integración Telegram, módulo de IA (Shaun Murphy) y CRM médico.

## 🚀 Quick Start

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

La aplicación estará disponible en `http://localhost:8080`

## 📁 Estructura del Proyecto

```
src/
├── components/
│   ├── dashboard/
│   │   ├── DashboardLayout.tsx    # Layout principal con sidebar
│   │   ├── PatientCard.tsx        # Tarjeta de información del paciente
│   │   ├── HabitTrackerCard.tsx   # Seguimiento de hábitos diarios
│   │   ├── XPDonut.tsx            # Gráfico circular de progreso XP
│   │   ├── CRMList.tsx            # Lista CRM para médicos
│   │   ├── GlucoseChart.tsx       # Gráfico de tendencia glucémica
│   │   └── AlertsPanel.tsx        # Panel de alertas
│   └── ui/                        # Componentes Shadcn/UI
├── data/
│   └── mockPatients.json          # Datos mock (5 pacientes)
├── docs/
│   ├── ER_DIAGRAM.md              # Diagrama Entidad-Relación
│   ├── SQL_MIGRATION_DRAFT.sql    # Script SQL (borrador)
│   ├── RLS_POLICIES.md            # Políticas de seguridad RLS
│   └── SHAUN_MURPHY_IA_SPEC.md    # Especificación del módulo IA
├── pages/
│   ├── Index.tsx                  # Landing page con selección de rol
│   └── Dashboard.tsx              # Dashboard principal
├── types/
│   └── diabetes.ts                # Tipos TypeScript
└── index.css                      # Sistema de diseño (tokens)
```

## 🎨 Sistema de Diseño

Los tokens de diseño están definidos en `src/index.css`:

### Colores Principales
```css
--purple-500: #B46BFF;
--purple-400: #D08BFF;
--purple-600: #8A32FF;
--bg-dark-900: #0D021F;
--bg-dark-800: #1A0332;
```

### Efectos
```css
--shadow-glow: 0 8px 30px rgba(180,107,255,0.14);
--radius-lg: 24px;
```

### Clases Utilitarias
- `.glass-card` - Tarjetas con efecto glassmorphism
- `.glow-border` - Borde con efecto glow en hover
- `.glow-text` - Texto con sombra neón
- `.btn-neon` - Botón con estilo neón

## 👥 Roles de Usuario

| Rol | Descripción | Vista Principal |
|-----|-------------|-----------------|
| **Paciente** | Registra y visualiza sus datos | Dashboard personal con tracking |
| **Co-administrador** | Acompaña a un paciente | Vista espejo del paciente |
| **Médico** | Gestiona múltiples pacientes | CRM con priorización IA |

## 📊 Datos Mock

El archivo `src/data/mockPatients.json` contiene:
- 5 pacientes con diferentes perfiles
- Glucometrías, insulina, sueño y estrés
- Alertas de ejemplo (críticas y warnings)
- 4 coadministradores
- 2 médicos
- Reportes de IA de ejemplo

## 🔐 Seguridad (Documentación)

Ver `src/docs/RLS_POLICIES.md` para el borrador de políticas RLS:
- Pacientes: CRUD sobre sus propios datos
- Coadmins: Solo lectura (no pueden eliminar)
- Médicos: Lectura + creación de alertas/reportes

## 🤖 Shaun Murphy IA

Ver `src/docs/SHAUN_MURPHY_IA_SPEC.md` para:
- Especificación de inputs/outputs
- Tipos de alertas generadas
- Flujos de procesamiento
- Integración con Telegram

## 📱 Responsivo

La aplicación está diseñada mobile-first:
- **Mobile** (< 640px): Sidebar como drawer
- **Tablet** (768px+): Layout adaptativo
- **Desktop** (1024px+): Sidebar fijo, grid de 3 columnas

## 🛠️ Tecnologías

- **Framework**: React 18 + TypeScript
- **Estilos**: Tailwind CSS + tokens personalizados
- **Componentes**: Shadcn/UI
- **Gráficos**: Recharts
- **Routing**: React Router DOM
- **Estado**: TanStack Query (preparado)

## 📋 Próximos Pasos

1. ⬜ Conectar Lovable Cloud (Supabase)
2. ⬜ Implementar autenticación
3. ⬜ Ejecutar migraciones SQL
4. ⬜ Configurar bot de Telegram
5. ⬜ Integrar Shaun Murphy IA con Lovable AI

---

**Versión**: 1.0.0-beta  
**Licencia**: Privada
