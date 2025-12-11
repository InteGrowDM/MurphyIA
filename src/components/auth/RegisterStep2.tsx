import { UseFormReturn, Controller } from 'react-hook-form';
import { PatientRegistrationData, Gender } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { User, Phone, Calendar as CalendarIcon, CreditCard } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface RegisterStep2Props {
  form: UseFormReturn<PatientRegistrationData>;
}

const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'masculino', label: 'Masculino' },
  { value: 'femenino', label: 'Femenino' },
  { value: 'otro', label: 'Otro' },
  { value: 'prefiero_no_decir', label: 'Prefiero no decir' },
];

export const RegisterStep2 = ({ form }: RegisterStep2Props) => {
  const { register, control, formState: { errors } } = form;

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Datos Personales</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Información básica para tu perfil
        </p>
      </div>

      <div className="space-y-4">
        {/* Full Name */}
        <div className="space-y-2">
          <Label htmlFor="fullName">Nombre completo</Label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="fullName"
              placeholder="Juan Pérez García"
              className="pl-10"
              {...register('fullName')}
            />
          </div>
          {errors.fullName && (
            <p className="text-sm text-destructive">{errors.fullName.message}</p>
          )}
        </div>

        {/* Phone */}
        <div className="space-y-2">
          <Label htmlFor="phone">Número de contacto</Label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              placeholder="+57 300 123 4567"
              className="pl-10"
              {...register('phone')}
            />
          </div>
          {errors.phone && (
            <p className="text-sm text-destructive">{errors.phone.message}</p>
          )}
        </div>

        {/* Birth Date */}
        <div className="space-y-2">
          <Label>Fecha de nacimiento</Label>
          <Controller
            control={control}
            name="birthDate"
            render={({ field }) => (
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !field.value && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      format(field.value, "PPP", { locale: es })
                    ) : (
                      <span>Selecciona tu fecha de nacimiento</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date("1900-01-01")
                    }
                    initialFocus
                    captionLayout="dropdown-buttons"
                    fromYear={1920}
                    toYear={new Date().getFullYear()}
                  />
                </PopoverContent>
              </Popover>
            )}
          />
          {errors.birthDate && (
            <p className="text-sm text-destructive">{errors.birthDate.message}</p>
          )}
        </div>

        {/* Gender */}
        <div className="space-y-2">
          <Label>Sexo</Label>
          <Controller
            control={control}
            name="gender"
            render={({ field }) => (
              <Select onValueChange={field.onChange} value={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona tu sexo" />
                </SelectTrigger>
                <SelectContent>
                  {GENDER_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          />
          {errors.gender && (
            <p className="text-sm text-destructive">{errors.gender.message}</p>
          )}
        </div>

        {/* ID Number */}
        <div className="space-y-2">
          <Label htmlFor="idNumber">Número de identidad (Cédula)</Label>
          <div className="relative">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              id="idNumber"
              placeholder="1234567890"
              className="pl-10"
              {...register('idNumber')}
            />
          </div>
          {errors.idNumber && (
            <p className="text-sm text-destructive">{errors.idNumber.message}</p>
          )}
        </div>
      </div>
    </div>
  );
};
