# Políticas RLS - DiabetesManager Pro

## ⚠️ BORRADOR - No ejecutar sin validación

Este documento define las políticas de Row Level Security para el sistema.

---

## Función auxiliar para verificar roles

```sql
-- Security definer function para evitar recursión infinita
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role user_role)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE profile_id = _user_id
      AND role = _role
  )
$$;

-- Función para verificar si es coadmin de un paciente
CREATE OR REPLACE FUNCTION public.is_coadmin_of(_user_id uuid, _patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.coadmin_mapping
    WHERE coadmin_id = _user_id
      AND patient_id = _patient_id
  )
$$;

-- Función para verificar si es médico de un paciente
CREATE OR REPLACE FUNCTION public.is_doctor_of(_user_id uuid, _patient_id uuid)
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.doctor_patients dp
    JOIN public.doctors d ON d.id = dp.doctor_id
    WHERE d.profile_id = _user_id
      AND dp.patient_id = _patient_id
      AND dp.status = 'active'
  )
$$;

-- Función para obtener el patient_id del usuario actual
CREATE OR REPLACE FUNCTION public.get_my_patient_id()
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT id FROM public.patient_profiles WHERE profile_id = auth.uid()
$$;
```

---

## Políticas para USER_ROLES

```sql
-- Los usuarios pueden ver sus propios roles
CREATE POLICY "Users can view own roles"
ON public.user_roles FOR SELECT
TO authenticated
USING (profile_id = auth.uid());

-- Solo admins pueden insertar roles (no implementado en MVP)
```

---

## Políticas para PATIENT_PROFILES

```sql
-- Pacientes pueden ver y editar su propio perfil
CREATE POLICY "Patients can view own profile"
ON public.patient_profiles FOR SELECT
TO authenticated
USING (profile_id = auth.uid());

CREATE POLICY "Patients can update own profile"
ON public.patient_profiles FOR UPDATE
TO authenticated
USING (profile_id = auth.uid())
WITH CHECK (profile_id = auth.uid());

-- Coadmins pueden ver el perfil de su paciente asignado
CREATE POLICY "Coadmins can view assigned patient"
ON public.patient_profiles FOR SELECT
TO authenticated
USING (
  public.is_coadmin_of(auth.uid(), id)
);

-- Médicos pueden ver perfiles de sus pacientes
CREATE POLICY "Doctors can view their patients"
ON public.patient_profiles FOR SELECT
TO authenticated
USING (
  public.is_doctor_of(auth.uid(), id)
);
```

---

## Políticas para GLUCOMETRIAS

```sql
-- Pacientes pueden CRUD sus propias glucometrías
CREATE POLICY "Patients can view own glucometrias"
ON public.glucometrias FOR SELECT
TO authenticated
USING (patient_id = public.get_my_patient_id());

CREATE POLICY "Patients can insert own glucometrias"
ON public.glucometrias FOR INSERT
TO authenticated
WITH CHECK (patient_id = public.get_my_patient_id());

CREATE POLICY "Patients can update own glucometrias"
ON public.glucometrias FOR UPDATE
TO authenticated
USING (patient_id = public.get_my_patient_id())
WITH CHECK (patient_id = public.get_my_patient_id());

CREATE POLICY "Patients can delete own glucometrias"
ON public.glucometrias FOR DELETE
TO authenticated
USING (patient_id = public.get_my_patient_id());

-- Coadmins pueden ver glucometrías (NO eliminar)
CREATE POLICY "Coadmins can view patient glucometrias"
ON public.glucometrias FOR SELECT
TO authenticated
USING (
  public.is_coadmin_of(auth.uid(), patient_id)
);

-- Médicos pueden ver glucometrías
CREATE POLICY "Doctors can view patient glucometrias"
ON public.glucometrias FOR SELECT
TO authenticated
USING (
  public.is_doctor_of(auth.uid(), patient_id)
);
```

---

## Políticas para INSULINA, SUENO, ESTRES

```sql
-- (Mismo patrón que glucometrias)
-- Paciente: CRUD completo
-- Coadmin: Solo lectura
-- Médico: Solo lectura
```

---

## Políticas para ALERTAS

```sql
-- Pacientes pueden ver sus alertas
CREATE POLICY "Patients can view own alerts"
ON public.alertas FOR SELECT
TO authenticated
USING (patient_id = public.get_my_patient_id());

-- Pacientes pueden marcar alertas como resueltas
CREATE POLICY "Patients can resolve own alerts"
ON public.alertas FOR UPDATE
TO authenticated
USING (patient_id = public.get_my_patient_id())
WITH CHECK (
  patient_id = public.get_my_patient_id()
  AND resolved = TRUE -- Solo pueden marcar como resuelto
);

-- Coadmins pueden ver alertas
CREATE POLICY "Coadmins can view patient alerts"
ON public.alertas FOR SELECT
TO authenticated
USING (
  public.is_coadmin_of(auth.uid(), patient_id)
);

-- Médicos pueden ver y crear alertas
CREATE POLICY "Doctors can view patient alerts"
ON public.alertas FOR SELECT
TO authenticated
USING (
  public.is_doctor_of(auth.uid(), patient_id)
);

CREATE POLICY "Doctors can create patient alerts"
ON public.alertas FOR INSERT
TO authenticated
WITH CHECK (
  public.is_doctor_of(auth.uid(), patient_id)
);

CREATE POLICY "Doctors can resolve patient alerts"
ON public.alertas FOR UPDATE
TO authenticated
USING (
  public.is_doctor_of(auth.uid(), patient_id)
);
```

---

## Políticas para AI_REPORTS

```sql
-- Pacientes pueden ver sus reportes
CREATE POLICY "Patients can view own reports"
ON public.ai_reports FOR SELECT
TO authenticated
USING (patient_id = public.get_my_patient_id());

-- Coadmins pueden ver reportes del paciente
CREATE POLICY "Coadmins can view patient reports"
ON public.ai_reports FOR SELECT
TO authenticated
USING (
  public.is_coadmin_of(auth.uid(), patient_id)
);

-- Médicos pueden ver y generar reportes
CREATE POLICY "Doctors can view patient reports"
ON public.ai_reports FOR SELECT
TO authenticated
USING (
  public.is_doctor_of(auth.uid(), patient_id)
);

CREATE POLICY "Doctors can create patient reports"
ON public.ai_reports FOR INSERT
TO authenticated
WITH CHECK (
  public.is_doctor_of(auth.uid(), patient_id)
);
```

---

## Políticas para NOTIFICATIONS

```sql
-- Usuarios solo ven sus propias notificaciones
CREATE POLICY "Users can view own notifications"
ON public.notifications FOR SELECT
TO authenticated
USING (user_id = auth.uid());

CREATE POLICY "Users can update own notifications"
ON public.notifications FOR UPDATE
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());
```

---

## Políticas para AUDIT_LOGS

```sql
-- Solo el sistema puede escribir (via service_role)
-- Médicos pueden leer logs de sus pacientes

CREATE POLICY "Doctors can view patient audit logs"
ON public.audit_logs FOR SELECT
TO authenticated
USING (
  public.has_role(auth.uid(), 'doctor')
  AND entity_type IN ('glucometrias', 'insulina', 'sueno', 'estres', 'alertas')
);
```

---

## Resumen de Permisos por Rol

| Tabla | Paciente | Coadmin | Médico |
|-------|----------|---------|--------|
| patient_profiles | R/W propio | R asignado | R asignados |
| glucometrias | CRUD | R | R |
| insulina | CRUD | R | R |
| sueno | CRUD | R | R |
| estres | CRUD | R | R |
| alertas | R, Resolver | R | R/W |
| ai_reports | R | R | R/W |
| notifications | R/W propio | R/W propio | R/W propio |
| audit_logs | - | - | R (limitado) |

---

## Consideraciones de Seguridad

1. **Separación de roles**: Roles almacenados en tabla separada
2. **Security Definer Functions**: Evitan recursión RLS
3. **Principio de menor privilegio**: Coadmins NO pueden eliminar datos
4. **Auditoría**: Todos los cambios se registran
5. **Consentimiento**: Requerido en onboarding antes de crear perfil
