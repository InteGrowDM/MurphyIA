-- ============================================
-- DiabetesManager Pro - SQL Migration Draft
-- ⚠️ NO EJECUTAR - Solo borrador para validación
-- ============================================

-- Extensiones necesarias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- ENUMERACIONES
-- ============================================

CREATE TYPE diabetes_type AS ENUM ('Tipo 1', 'Tipo 2', 'Gestacional', 'LADA', 'MODY');
CREATE TYPE glucometry_type AS ENUM ('fasting', 'preprandial', 'postprandial', 'random', 'nocturnal');
CREATE TYPE insulin_type AS ENUM ('rapid', 'short', 'intermediate', 'basal', 'mixed');
CREATE TYPE alert_severity AS ENUM ('info', 'warning', 'critical');
CREATE TYPE alert_type AS ENUM ('hypoglycemia', 'hyperglycemia', 'missed_dose', 'pattern', 'streak', 'reminder');
CREATE TYPE user_role AS ENUM ('patient', 'coadmin', 'doctor');

-- ============================================
-- TABLAS PRINCIPALES
-- ============================================

-- Tabla de roles de usuario (separada de profiles por seguridad)
CREATE TABLE public.user_roles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    role user_role NOT NULL,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    assigned_by UUID REFERENCES auth.users(id),
    UNIQUE(profile_id, role)
);

-- Perfiles de pacientes
CREATE TABLE public.patient_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    diabetes_type diabetes_type NOT NULL,
    age INTEGER CHECK (age > 0 AND age < 150),
    estrato INTEGER CHECK (estrato >= 1 AND estrato <= 6),
    telegram_id TEXT,
    telegram_connected BOOLEAN DEFAULT FALSE,
    xp_level INTEGER DEFAULT 0 CHECK (xp_level >= 0 AND xp_level <= 100),
    streak INTEGER DEFAULT 0 CHECK (streak >= 0),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Perfiles de médicos
CREATE TABLE public.doctors (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    profile_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    specialty TEXT NOT NULL,
    license_number TEXT NOT NULL UNIQUE,
    verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Mapeo coadministrador-paciente (1:1)
CREATE TABLE public.coadmin_mapping (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    coadmin_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    permissions JSONB DEFAULT '{"view": true, "add_notes": true, "send_reminders": true}'::jsonb,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(patient_id) -- Solo 1 coadmin por paciente
);

-- Relación médico-paciente (N:N)
CREATE TABLE public.doctor_patients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    doctor_id UUID NOT NULL REFERENCES public.doctors(id) ON DELETE CASCADE,
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    assigned_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'transferred')),
    UNIQUE(doctor_id, patient_id)
);

-- ============================================
-- TABLAS DE DATOS MÉDICOS
-- ============================================

-- Glucometrías
CREATE TABLE public.glucometrias (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    value INTEGER NOT NULL CHECK (value > 0 AND value < 700),
    type glucometry_type NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dosis de insulina
CREATE TABLE public.insulina (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    units INTEGER NOT NULL CHECK (units > 0 AND units < 200),
    type insulin_type NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Registro de sueño
CREATE TABLE public.sueno (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    hours DECIMAL(4,2) NOT NULL CHECK (hours >= 0 AND hours <= 24),
    quality INTEGER NOT NULL CHECK (quality >= 1 AND quality <= 10),
    date DATE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(patient_id, date)
);

-- Registro de estrés
CREATE TABLE public.estres (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    level INTEGER NOT NULL CHECK (level >= 1 AND level <= 10),
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    notes TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- ALERTAS Y NOTIFICACIONES
-- ============================================

-- Alertas del sistema
CREATE TABLE public.alertas (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    type alert_type NOT NULL,
    severity alert_severity NOT NULL,
    message TEXT NOT NULL,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    resolved BOOLEAN DEFAULT FALSE,
    resolved_by UUID REFERENCES auth.users(id),
    resolved_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Notificaciones generales
CREATE TABLE public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- REPORTES DE IA
-- ============================================

CREATE TABLE public.ai_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    summary JSONB NOT NULL,
    recommendations TEXT[] NOT NULL DEFAULT '{}',
    pdf_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================
-- AUDITORÍA
-- ============================================

CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    entity_type TEXT NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================
-- ÍNDICES
-- ============================================

CREATE INDEX idx_glucometrias_patient_timestamp ON public.glucometrias(patient_id, timestamp DESC);
CREATE INDEX idx_insulina_patient_timestamp ON public.insulina(patient_id, timestamp DESC);
CREATE INDEX idx_alertas_patient_unresolved ON public.alertas(patient_id) WHERE resolved = FALSE;
CREATE INDEX idx_alertas_severity ON public.alertas(severity) WHERE resolved = FALSE;
CREATE INDEX idx_ai_reports_patient ON public.ai_reports(patient_id, generated_at DESC);
CREATE INDEX idx_audit_logs_entity ON public.audit_logs(entity_type, entity_id);
CREATE INDEX idx_notifications_user_unread ON public.notifications(user_id) WHERE read = FALSE;

-- ============================================
-- TRIGGERS
-- ============================================

-- Función para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger para patient_profiles
CREATE TRIGGER trigger_patient_profiles_updated_at
    BEFORE UPDATE ON public.patient_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at();

-- ============================================
-- HABILITAR RLS
-- ============================================

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.patient_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.coadmin_mapping ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.doctor_patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.glucometrias ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.insulina ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.sueno ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.estres ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.alertas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ai_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- ⚠️ Las políticas RLS se definen en RLS_POLICIES.md
