-- Crear tabla insulin_schedules para tracking de régimen de insulina
CREATE TABLE public.insulin_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  insulin_type TEXT NOT NULL CHECK (insulin_type IN ('rapid', 'basal')),
  times_per_day INTEGER NOT NULL CHECK (times_per_day >= 1 AND times_per_day <= 6),
  units_per_dose DECIMAL(5,1) NOT NULL CHECK (units_per_dose > 0 AND units_per_dose <= 100),
  brand TEXT,
  effective_from DATE NOT NULL DEFAULT CURRENT_DATE,
  effective_until DATE,
  change_reason TEXT,
  ordered_by TEXT,
  changed_by_user_id UUID,
  changed_by_role TEXT CHECK (changed_by_role IN ('patient', 'coadmin')),
  notes TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Índice parcial único: solo un registro activo por tipo por paciente
CREATE UNIQUE INDEX idx_insulin_one_active_per_type 
ON public.insulin_schedules(patient_id, insulin_type) 
WHERE is_active = true;

-- Índice para consultas de historial
CREATE INDEX idx_insulin_patient_type_date 
ON public.insulin_schedules(patient_id, insulin_type, effective_from DESC);

-- Habilitar RLS
ALTER TABLE public.insulin_schedules ENABLE ROW LEVEL SECURITY;

-- Política: Pacientes CRUD completo en sus registros
CREATE POLICY "Patients can manage own insulin"
ON public.insulin_schedules FOR ALL
TO authenticated
USING (patient_id IN (SELECT id FROM public.patient_profiles WHERE user_id = auth.uid()))
WITH CHECK (patient_id IN (SELECT id FROM public.patient_profiles WHERE user_id = auth.uid()));

-- Política: Co-admins pueden VER registros del paciente asignado
CREATE POLICY "Coadmins can view patient insulin"
ON public.insulin_schedules FOR SELECT
TO authenticated
USING (patient_id IN (SELECT patient_id FROM public.coadmin_profiles WHERE user_id = auth.uid()));

-- Política: Co-admins pueden INSERTAR registros del paciente asignado
CREATE POLICY "Coadmins can insert patient insulin"
ON public.insulin_schedules FOR INSERT
TO authenticated
WITH CHECK (patient_id IN (SELECT patient_id FROM public.coadmin_profiles WHERE user_id = auth.uid()));

-- Política: Co-admins pueden ACTUALIZAR registros del paciente asignado
CREATE POLICY "Coadmins can update patient insulin"
ON public.insulin_schedules FOR UPDATE
TO authenticated
USING (patient_id IN (SELECT patient_id FROM public.coadmin_profiles WHERE user_id = auth.uid()))
WITH CHECK (patient_id IN (SELECT patient_id FROM public.coadmin_profiles WHERE user_id = auth.uid()));

-- Trigger para updated_at
CREATE TRIGGER update_insulin_schedules_updated_at
  BEFORE UPDATE ON public.insulin_schedules
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();