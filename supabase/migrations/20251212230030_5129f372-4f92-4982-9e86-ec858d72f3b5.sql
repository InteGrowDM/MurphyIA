-- Create AI call schedules table for voice assistant scheduling
CREATE TABLE public.ai_call_schedules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  scheduled_by_user_id UUID NOT NULL,
  scheduled_by_role TEXT NOT NULL CHECK (scheduled_by_role IN ('patient', 'coadmin')),
  call_time TIME NOT NULL,
  days_of_week INTEGER[] NOT NULL CHECK (array_length(days_of_week, 1) > 0),
  call_purposes TEXT[] NOT NULL CHECK (array_length(call_purposes, 1) > 0),
  custom_message TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.ai_call_schedules ENABLE ROW LEVEL SECURITY;

-- Index for patient lookups
CREATE INDEX idx_ai_call_schedules_patient ON public.ai_call_schedules(patient_id);

-- Patients can manage their own call schedules
CREATE POLICY "Patients can manage own call schedules"
ON public.ai_call_schedules FOR ALL
USING (patient_id IN (SELECT id FROM patient_profiles WHERE user_id = auth.uid()))
WITH CHECK (patient_id IN (SELECT id FROM patient_profiles WHERE user_id = auth.uid()));

-- Coadmins can manage call schedules for their assigned patient
CREATE POLICY "Coadmins can manage patient call schedules"
ON public.ai_call_schedules FOR ALL
USING (patient_id IN (SELECT patient_id FROM coadmin_profiles WHERE user_id = auth.uid()))
WITH CHECK (patient_id IN (SELECT patient_id FROM coadmin_profiles WHERE user_id = auth.uid()));

-- Trigger for updated_at
CREATE TRIGGER update_ai_call_schedules_updated_at
BEFORE UPDATE ON public.ai_call_schedules
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();