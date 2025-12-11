-- 1. Create coadmin_profiles table
CREATE TABLE public.coadmin_profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  patient_id UUID NOT NULL REFERENCES public.patient_profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Un coadmin solo puede estar vinculado a un paciente
  CONSTRAINT unique_coadmin_user UNIQUE(user_id),
  -- Un paciente solo puede tener un coadmin
  CONSTRAINT unique_coadmin_patient UNIQUE(patient_id)
);

-- Enable RLS
ALTER TABLE public.coadmin_profiles ENABLE ROW LEVEL SECURITY;

-- 2. Create function to verify authorized coadmin email
CREATE OR REPLACE FUNCTION public.is_authorized_coadmin_email(_email TEXT)
RETURNS TABLE(patient_profile_id UUID, patient_name TEXT)
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT pp.id, p.full_name
  FROM patient_profiles pp
  JOIN profiles p ON p.id = pp.user_id
  WHERE LOWER(pp.coadmin_email) = LOWER(_email)
    AND NOT EXISTS (
      SELECT 1 FROM coadmin_profiles cp WHERE cp.patient_id = pp.id
    )
$$;

-- 3. Update handle_new_user trigger to support coadmin role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  _role user_role;
  _patient_id UUID;
BEGIN
  -- Determine role from metadata (default: patient)
  _role := COALESCE(
    (NEW.raw_user_meta_data ->> 'role')::user_role, 
    'patient'
  );
  
  -- Insert basic profile
  INSERT INTO public.profiles (id, full_name, phone)
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', ''),
    NEW.raw_user_meta_data ->> 'phone'
  );
  
  -- Insert user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, _role);
  
  -- If coadmin, create coadmin_profile with patient link
  IF _role = 'coadmin' THEN
    _patient_id := (NEW.raw_user_meta_data ->> 'patient_id')::UUID;
    IF _patient_id IS NOT NULL THEN
      INSERT INTO public.coadmin_profiles (user_id, patient_id)
      VALUES (NEW.id, _patient_id);
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- 4. RLS Policies for coadmin_profiles
-- Coadmin can view their own profile
CREATE POLICY "Coadmins can view own profile" 
ON public.coadmin_profiles
FOR SELECT 
USING (auth.uid() = user_id);

-- Patients can view their linked coadmin
CREATE POLICY "Patients can view their coadmin" 
ON public.coadmin_profiles
FOR SELECT 
USING (
  patient_id IN (
    SELECT id FROM patient_profiles WHERE user_id = auth.uid()
  )
);

-- Add updated_at trigger for coadmin_profiles
CREATE TRIGGER update_coadmin_profiles_updated_at
BEFORE UPDATE ON public.coadmin_profiles
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();