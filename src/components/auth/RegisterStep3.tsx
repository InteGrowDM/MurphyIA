import { UseFormReturn, Controller } from 'react-hook-form';
import { PatientRegistrationData } from '@/types/auth';
import { DiabetesType } from '@/types/diabetes';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { MapPin, Activity, Calendar, Home } from 'lucide-react';

interface RegisterStep3Props {
  form: UseFormReturn<PatientRegistrationData>;
}

const DIABETES_TYPES: DiabetesType[] = ['Tipo 1', 'Tipo 2', 'Gestacional', 'LADA', 'MODY'];

const COLOMBIAN_CITIES = [
  'Bogotá', 'Medellín', 'Cali', 'Barranquilla', 'Cartagena',
  'Bucaramanga', 'Pereira', 'Santa Marta', 'Manizales', 'Ibagué',
  'Cúcuta', 'Villavicencio', 'Pasto', 'Montería', 'Neiva',
  'Armenia', 'Popayán', 'Sincelejo', 'Valledupar', 'Tunja'
];

export const RegisterStep3 = ({ form }: RegisterStep3Props) => {
  const { register, control, watch, formState: { errors } } = form;
  const estrato = watch('estrato');
  const currentYear = new Date().getFullYear();

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Información Médica y Ubicación</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Datos importantes para tu seguimiento
        </p>
      </div>

      <div className="space-y-4">
        {/* Diabetes Type */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Activity className="h-4 w-4 text-muted-foreground" />
            Tipo de diabetes
          </Label>
          <Controller
            control={control}
            name="diabetesType"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu tipo de diabetes" />
                </SelectTrigger>
                <SelectContent>
                  {DIABETES_TYPES.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.diabetesType && (
            <p className="text-sm text-destructive">{errors.diabetesType.message}</p>
          )}
        </div>

        {/* Diagnosis Year */}
        <div className="space-y-2">
          <Label htmlFor="diagnosisYear" className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-muted-foreground" />
            Año de diagnóstico
          </Label>
          <Input
            id="diagnosisYear"
            type="number"
            min={1900}
            max={currentYear}
            placeholder={`Ej: ${currentYear - 5}`}
            {...register('diagnosisYear', { valueAsNumber: true })}
          />
          {errors.diagnosisYear && (
            <p className="text-sm text-destructive">{errors.diagnosisYear.message}</p>
          )}
        </div>

        {/* City */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            Ciudad de residencia
          </Label>
          <Controller
            control={control}
            name="city"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu ciudad" />
                </SelectTrigger>
                <SelectContent>
                  {COLOMBIAN_CITIES.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.city && (
            <p className="text-sm text-destructive">{errors.city.message}</p>
          )}
        </div>

        {/* Estrato */}
        <div className="space-y-4">
          <Label className="flex items-center gap-2">
            <Home className="h-4 w-4 text-muted-foreground" />
            Estrato socioeconómico: <span className="font-bold text-primary">{estrato || 1}</span>
          </Label>
          <Controller
            control={control}
            name="estrato"
            render={({ field }) => (
              <Slider
                min={1}
                max={6}
                step={1}
                value={[field.value || 1]}
                onValueChange={(vals) => field.onChange(vals[0])}
                className="w-full"
              />
            )}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>1</span>
            <span>2</span>
            <span>3</span>
            <span>4</span>
            <span>5</span>
            <span>6</span>
          </div>
          {errors.estrato && (
            <p className="text-sm text-destructive">{errors.estrato.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
