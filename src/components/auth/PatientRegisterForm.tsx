import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { PatientRegistrationData } from '@/types/auth';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { StepIndicator } from './StepIndicator';
import { RegisterStep1 } from './RegisterStep1';
import { RegisterStep2 } from './RegisterStep2';
import { RegisterStep3 } from './RegisterStep3';
import { RegisterStep4 } from './RegisterStep4';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';

const currentYear = new Date().getFullYear();

const registrationSchema = z.object({
  // Step 1
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Mínimo 8 caracteres'),
  confirmPassword: z.string(),
  // Step 2
  fullName: z.string().min(2, 'Nombre requerido').max(100, 'Nombre muy largo'),
  phone: z.string().min(10, 'Teléfono inválido'),
  birthDate: z.date({ required_error: 'Fecha de nacimiento requerida' }),
  gender: z.enum(['masculino', 'femenino', 'otro', 'prefiero_no_decir'], {
    required_error: 'Selecciona tu sexo',
  }),
  idNumber: z.string().min(5, 'Número de identidad requerido'),
  // Step 3
  diabetesType: z.enum(['Tipo 1', 'Tipo 2', 'Gestacional', 'LADA', 'MODY'], {
    required_error: 'Selecciona tu tipo de diabetes',
  }),
  diagnosisYear: z.number()
    .min(1900, 'Año inválido')
    .max(currentYear, 'Año inválido'),
  city: z.string().min(2, 'Ciudad requerida'),
  estrato: z.number().min(1).max(6),
  // Step 4 (optional)
  coadminName: z.string().optional(),
  coadminPhone: z.string().optional(),
  coadminEmail: z.string().email('Email inválido').optional().or(z.literal('')),
  noCoadmin: z.boolean().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Las contraseñas no coinciden',
  path: ['confirmPassword'],
});

const STEP_LABELS = ['Acceso', 'Personal', 'Médico', 'Co-admin'];
const TOTAL_STEPS = 4;

// Fields per step for validation
const STEP_FIELDS: Record<number, (keyof PatientRegistrationData)[]> = {
  1: ['email', 'password', 'confirmPassword'],
  2: ['fullName', 'phone', 'birthDate', 'gender', 'idNumber'],
  3: ['diabetesType', 'diagnosisYear', 'city', 'estrato'],
  4: ['coadminName', 'coadminPhone', 'coadminEmail', 'noCoadmin'],
};

export const PatientRegisterForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { signUp } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const form = useForm<PatientRegistrationData>({
    resolver: zodResolver(registrationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      fullName: '',
      phone: '',
      gender: undefined,
      idNumber: '',
      diabetesType: undefined,
      diagnosisYear: currentYear,
      city: '',
      estrato: 3,
      coadminName: '',
      coadminPhone: '',
      coadminEmail: '',
      noCoadmin: false,
    },
    mode: 'onChange',
  });

  const validateCurrentStep = async () => {
    const fields = STEP_FIELDS[currentStep];
    const result = await form.trigger(fields);
    return result;
  };

  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid && currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const onSubmit = async (data: PatientRegistrationData) => {
    setIsSubmitting(true);
    try {
      const { error } = await signUp(data);
      
      if (error) {
        toast({
          variant: 'destructive',
          title: 'Error al registrarse',
          description: error.message,
        });
        return;
      }

      toast({
        title: '¡Cuenta creada!',
        description: 'Bienvenido a DiabetesManager',
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Ocurrió un error inesperado',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return <RegisterStep1 form={form} />;
      case 2:
        return <RegisterStep2 form={form} />;
      case 3:
        return <RegisterStep3 form={form} />;
      case 4:
        return <RegisterStep4 form={form} />;
      default:
        return null;
    }
  };

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="w-full max-w-md mx-auto">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        labels={STEP_LABELS}
      />

      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      <div className="flex justify-between mt-8 gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1 || isSubmitting}
          className="flex-1"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Atrás
        </Button>

        {currentStep < TOTAL_STEPS ? (
          <Button
            type="button"
            onClick={handleNext}
            className="flex-1"
          >
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            type="submit"
            disabled={isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creando cuenta...
              </>
            ) : (
              'Crear cuenta'
            )}
          </Button>
        )}
      </div>
    </form>
  );
};
