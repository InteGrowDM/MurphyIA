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
┌──────────────────┐                  └──────────────────────┘
│   USER_ROLES     │                           │
├──────────────────┤                           │ 1:N
│ id (PK)          │                           ▼
│ profile_id (FK)  │                  ┌──────────────────────┐
│ role (ENUM)      │                  │    GLUCOMETRIAS      │
│ assigned_at      │                  ├──────────────────────┤
└──────────────────┘                  │ id (PK, UUID)        │
                                      │ patient_id (FK)      │
                                      │ value (INTEGER)      │
┌──────────────────┐                  │ type (ENUM)          │
│  COADMIN_MAPPING │                  │ timestamp            │
├──────────────────┤                  │ notes                │
│ id (PK)          │                  └──────────────────────┘
│ coadmin_id (FK)  │
│ patient_id (FK)  │                  ┌──────────────────────┐
│ permissions      │                  │      INSULINA        │
│ assigned_at      │                  ├──────────────────────┤
└──────────────────┘                  │ id (PK, UUID)        │
                                      │ patient_id (FK)      │
                                      │ units (INTEGER)      │
                                      │ type (ENUM)          │
                                      │ timestamp            │
                                      │ notes                │
                                      └──────────────────────┘

                                      ┌──────────────────────┐
                                      │       SUENO          │
                                      ├──────────────────────┤
                                      │ id (PK, UUID)        │
                                      │ patient_id (FK)      │
                                      │ hours (DECIMAL)      │
                                      │ quality (1-10)       │
                                      │ date                 │
                                      └──────────────────────┘

                                      ┌──────────────────────┐
                                      │       ESTRES         │
                                      ├──────────────────────┤
                                      │ id (PK, UUID)        │
                                      │ patient_id (FK)      │
                                      │ level (1-10)         │
                                      │ timestamp            │
                                      │ notes                │
                                      └──────────────────────┘

┌──────────────────┐
│     ALERTAS      │
├──────────────────┤
│ id (PK, UUID)    │
│ patient_id (FK)  │
│ type (ENUM)      │
│ severity (ENUM)  │
│ message          │
│ timestamp        │
│ resolved         │
│ resolved_by      │
│ resolved_at      │
└──────────────────┘

┌──────────────────┐                  ┌──────────────────────┐
│  NOTIFICATIONS   │                  │    AUDIT_LOGS        │
├──────────────────┤                  ├──────────────────────┤
│ id (PK, UUID)    │                  │ id (PK, UUID)        │
│ user_id (FK)     │                  │ user_id (FK)         │
│ type             │                  │ action               │
│ title            │                  │ entity_type          │
│ message          │                  │ entity_id            │
│ read             │                  │ old_values (JSONB)   │
│ created_at       │                  │ new_values (JSONB)   │
└──────────────────┘                  │ ip_address           │
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
CREATE TYPE user_role AS ENUM ('patient', 'coadmin');
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

## Notas de Seguridad

- Todos los IDs son UUID para evitar ataques de enumeración
- Las tablas sensibles tienen RLS habilitado
- Audit_Logs captura todas las operaciones CRUD
- Consentimiento explícito requerido en onboarding
