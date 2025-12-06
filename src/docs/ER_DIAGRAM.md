# Diagrama ER - DiabetesManager Pro

## Modelo Conceptual (Borrador)

```
┌─────────────────────────────────────────────────────────────────────────────────┐
│                              DIAGRAMA ENTIDAD-RELACIÓN                          │
└─────────────────────────────────────────────────────────────────────────────────┘

┌──────────────────┐       1:1        ┌──────────────────────┐
│     PROFILES     │─────────────────▶│   PATIENT_PROFILES   │
│  (auth.users)    │                  │                      │
├──────────────────┤                  ├──────────────────────┤
│ id (PK, UUID)    │                  │ id (PK, UUID)        │
│ email            │                  │ profile_id (FK)      │
│ created_at       │                  │ diabetes_type        │
│ updated_at       │                  │ estrato              │
└──────────────────┘                  │ age                  │
        │                             │ telegram_id          │
        │                             │ telegram_connected   │
        │ 1:N                         │ xp_level             │
        ▼                             │ streak               │
┌──────────────────┐                  │ doctor_id (FK)       │
│   USER_ROLES     │                  └──────────────────────┘
├──────────────────┤                           │
│ id (PK)          │                           │ 1:N
│ profile_id (FK)  │                           ▼
│ role (ENUM)      │                  ┌──────────────────────┐
│ assigned_at      │                  │    GLUCOMETRIAS      │
└──────────────────┘                  ├──────────────────────┤
                                      │ id (PK, UUID)        │
                                      │ patient_id (FK)      │
┌──────────────────┐                  │ value (INTEGER)      │
│  COADMIN_MAPPING │                  │ type (ENUM)          │
├──────────────────┤                  │ timestamp            │
│ id (PK)          │                  │ notes                │
│ coadmin_id (FK)  │                  └──────────────────────┘
│ patient_id (FK)  │
│ permissions      │                  ┌──────────────────────┐
│ assigned_at      │                  │      INSULINA        │
└──────────────────┘                  ├──────────────────────┤
                                      │ id (PK, UUID)        │
                                      │ patient_id (FK)      │
┌──────────────────┐                  │ units (INTEGER)      │
│     DOCTORS      │                  │ type (ENUM)          │
├──────────────────┤                  │ timestamp            │
│ id (PK, UUID)    │                  │ notes                │
│ profile_id (FK)  │                  └──────────────────────┘
│ specialty        │
│ license_number   │                  ┌──────────────────────┐
│ verified         │                  │       SUENO          │
└──────────────────┘                  ├──────────────────────┤
        │                             │ id (PK, UUID)        │
        │ 1:N                         │ patient_id (FK)      │
        ▼                             │ hours (DECIMAL)      │
┌──────────────────┐                  │ quality (1-10)       │
│  DOCTOR_PATIENTS │                  │ date                 │
├──────────────────┤                  └──────────────────────┘
│ id (PK)          │
│ doctor_id (FK)   │                  ┌──────────────────────┐
│ patient_id (FK)  │                  │       ESTRES         │
│ assigned_at      │                  ├──────────────────────┤
│ status           │                  │ id (PK, UUID)        │
└──────────────────┘                  │ patient_id (FK)      │
                                      │ level (1-10)         │
                                      │ timestamp            │
┌──────────────────┐                  │ notes                │
│     ALERTAS      │                  └──────────────────────┘
├──────────────────┤
│ id (PK, UUID)    │
│ patient_id (FK)  │                  ┌──────────────────────┐
│ type (ENUM)      │                  │   AI_REPORTS         │
│ severity (ENUM)  │                  ├──────────────────────┤
│ message          │                  │ id (PK, UUID)        │
│ timestamp        │                  │ patient_id (FK)      │
│ resolved         │                  │ generated_at         │
│ resolved_by      │                  │ summary (JSONB)      │
│ resolved_at      │                  │ recommendations[]    │
└──────────────────┘                  │ pdf_url              │
                                      └──────────────────────┘

┌──────────────────┐
│  NOTIFICATIONS   │                  ┌──────────────────────┐
├──────────────────┤                  │    AUDIT_LOGS        │
│ id (PK, UUID)    │                  ├──────────────────────┤
│ user_id (FK)     │                  │ id (PK, UUID)        │
│ type             │                  │ user_id (FK)         │
│ title            │                  │ action               │
│ message          │                  │ entity_type          │
│ read             │                  │ entity_id            │
│ created_at       │                  │ old_values (JSONB)   │
└──────────────────┘                  │ new_values (JSONB)   │
                                      │ ip_address           │
                                      │ timestamp            │
                                      └──────────────────────┘
```

## Enumeraciones

```sql
-- Tipos de diabetes
CREATE TYPE diabetes_type AS ENUM ('Tipo 1', 'Tipo 2', 'Gestacional', 'LADA', 'MODY');

-- Tipos de glucometría
CREATE TYPE glucometry_type AS ENUM ('fasting', 'preprandial', 'postprandial', 'random', 'nocturnal');

-- Tipos de insulina
CREATE TYPE insulin_type AS ENUM ('rapid', 'short', 'intermediate', 'basal', 'mixed');

-- Severidad de alertas
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');

-- Tipos de alertas
CREATE TYPE alert_type AS ENUM ('hypoglycemia', 'hyperglycemia', 'missed_dose', 'pattern', 'streak', 'reminder');

-- Roles de usuario
CREATE TYPE user_role AS ENUM ('patient', 'coadmin', 'doctor');
```

## Relaciones Clave

1. **Profiles → Patient_Profiles**: 1:1 (Un usuario puede ser paciente)
2. **Profiles → User_Roles**: 1:N (Un usuario puede tener múltiples roles)
3. **Patient_Profiles → Glucometrias**: 1:N
4. **Patient_Profiles → Insulina**: 1:N
5. **Patient_Profiles → Sueno**: 1:N
6. **Patient_Profiles → Estres**: 1:N
7. **Patient_Profiles → Alertas**: 1:N
8. **Coadmin_Mapping**: Relaciona coadmin con paciente (1 coadmin por paciente)
9. **Doctor_Patients**: Relaciona médicos con pacientes (N:N)
10. **AI_Reports**: Reportes generados por Shaun Murphy IA

## Notas de Seguridad

- Todos los IDs son UUID para evitar ataques de enumeración
- Las tablas sensibles tienen RLS habilitado
- Audit_Logs captura todas las operaciones CRUD
- Consentimiento explícito requerido en onboarding
