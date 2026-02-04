-- Create blood_pressure_records table
CREATE TABLE public.blood_pressure_records (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id uuid NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  systolic integer NOT NULL,
  diastolic integer NOT NULL,
  pulse integer,
  position text,
  arm text,
  recorded_at timestamptz NOT NULL DEFAULT now(),
  notes text,
  created_at timestamptz DEFAULT now()
);

-- Create index for efficient queries by patient and date
CREATE INDEX idx_blood_pressure_patient_date 
  ON public.blood_pressure_records(patient_id, recorded_at DESC);

-- Enable RLS
ALTER TABLE public.blood_pressure_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies (same pattern as stress_records)
CREATE POLICY "Patients can manage own blood pressure records"
  ON public.blood_pressure_records
  FOR ALL
  USING (patient_id IN (
    SELECT id FROM public.patient_profiles WHERE user_id = auth.uid()
  ));

CREATE POLICY "Coadmins can view patient blood pressure records"
  ON public.blood_pressure_records
  FOR SELECT
  USING (patient_id IN (
    SELECT patient_id FROM public.coadmin_profiles WHERE user_id = auth.uid()
  ));