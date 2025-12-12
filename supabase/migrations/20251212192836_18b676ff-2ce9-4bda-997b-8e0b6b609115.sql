-- Create glucose_records table
CREATE TABLE public.glucose_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  time_slot TEXT NOT NULL,
  value INTEGER NOT NULL CHECK (value >= 20 AND value <= 600),
  recorded_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create indexes for efficient queries
CREATE INDEX idx_glucose_records_patient ON glucose_records(patient_id);
CREATE INDEX idx_glucose_records_patient_date ON glucose_records(patient_id, date);

-- Create trigger for updated_at (uses existing function)
CREATE TRIGGER update_glucose_records_updated_at
  BEFORE UPDATE ON glucose_records
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Enable Row Level Security
ALTER TABLE public.glucose_records ENABLE ROW LEVEL SECURITY;

-- Patients can manage their own glucose records
CREATE POLICY "Patients can manage own glucose records" ON glucose_records
  FOR ALL USING (
    patient_id IN (SELECT id FROM patient_profiles WHERE user_id = auth.uid())
  );

-- Coadmins can view patient glucose records
CREATE POLICY "Coadmins can view patient glucose records" ON glucose_records
  FOR SELECT USING (
    patient_id IN (SELECT patient_id FROM coadmin_profiles WHERE user_id = auth.uid())
  );