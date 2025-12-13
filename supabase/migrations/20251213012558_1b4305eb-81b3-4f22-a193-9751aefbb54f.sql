-- Sleep records table
CREATE TABLE public.sleep_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  hours NUMERIC(3,1) NOT NULL,
  quality INTEGER NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT sleep_unique_per_day UNIQUE (patient_id, date)
);

-- Stress records table
CREATE TABLE public.stress_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  level INTEGER NOT NULL,
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Dizziness records table
CREATE TABLE public.dizziness_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  severity INTEGER NOT NULL,
  symptoms TEXT[],
  duration_minutes INTEGER,
  notes TEXT,
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.sleep_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.stress_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.dizziness_records ENABLE ROW LEVEL SECURITY;

-- Sleep RLS policies
CREATE POLICY "Patients can manage own sleep records"
ON public.sleep_records FOR ALL
USING (patient_id IN (SELECT id FROM patient_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Coadmins can view patient sleep records"
ON public.sleep_records FOR SELECT
USING (patient_id IN (SELECT patient_id FROM coadmin_profiles WHERE user_id = auth.uid()));

-- Stress RLS policies
CREATE POLICY "Patients can manage own stress records"
ON public.stress_records FOR ALL
USING (patient_id IN (SELECT id FROM patient_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Coadmins can view patient stress records"
ON public.stress_records FOR SELECT
USING (patient_id IN (SELECT patient_id FROM coadmin_profiles WHERE user_id = auth.uid()));

-- Dizziness RLS policies
CREATE POLICY "Patients can manage own dizziness records"
ON public.dizziness_records FOR ALL
USING (patient_id IN (SELECT id FROM patient_profiles WHERE user_id = auth.uid()));

CREATE POLICY "Coadmins can view patient dizziness records"
ON public.dizziness_records FOR SELECT
USING (patient_id IN (SELECT patient_id FROM coadmin_profiles WHERE user_id = auth.uid()));