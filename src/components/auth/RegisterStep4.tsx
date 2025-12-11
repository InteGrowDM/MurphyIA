import { UseFormReturn, Controller } from 'react-hook-form';
import { PatientRegistrationData } from '@/types/auth';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { User, Phone, Mail, Users } from 'lucide-react';

interface RegisterStep4Props {
  form: UseFormReturn<PatientRegistrationData>;
}

export const RegisterStep4 = ({ form }: RegisterStep4Props) => {
  const { register, control, watch, formState: { errors } } = form;
  const noCoadmin = watch('noCoadmin');

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-xl font-semibold text-foreground">Co-administrador</h2>
        <p className="text-muted-foreground text-sm mt-1">
          Persona de confianza que puede ayudarte con tu seguimiento (opcional)
        </p>
      </div>

      <div className="p-4 rounded-lg bg-muted/50 border border-border mb-4">
        <div className="flex items-start gap-3">
          <Users className="h-5 w-5 text-primary mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-foreground">¿Qué es un co-administrador?</p>
            <p className="text-muted-foreground mt-1">
              Un familiar o cuidador que podrá ver tus registros de glucosa y recibir alertas 
              para ayudarte en el manejo de tu diabetes.
            </p>
          </div>
        </div>
      </div>

      {/* No coadmin checkbox */}
      <div className="flex items-center space-x-2">
        <Controller
          control={control}
          name="noCoadmin"
          render={({ field }) => (
            <Checkbox
              id="noCoadmin"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <Label htmlFor="noCoadmin" className="text-sm cursor-pointer">
          No tengo co-administrador por ahora
        </Label>
      </div>

      {!noCoadmin && (
        <div className="space-y-4 animate-in fade-in slide-in-from-top-2 duration-300">
          {/* Coadmin Name */}
          <div className="space-y-2">
            <Label htmlFor="coadminName">Nombre del co-administrador</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="coadminName"
                placeholder="María García"
                className="pl-10"
                {...register('coadminName')}
              />
            </div>
            {errors.coadminName && (
              <p className="text-sm text-destructive">{errors.coadminName.message}</p>
            )}
          </div>

          {/* Coadmin Phone */}
          <div className="space-y-2">
            <Label htmlFor="coadminPhone">Teléfono del co-administrador</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="coadminPhone"
                placeholder="+57 300 123 4567"
                className="pl-10"
                {...register('coadminPhone')}
              />
            </div>
            {errors.coadminPhone && (
              <p className="text-sm text-destructive">{errors.coadminPhone.message}</p>
            )}
          </div>

          {/* Coadmin Email */}
          <div className="space-y-2">
            <Label htmlFor="coadminEmail">Correo del co-administrador</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="coadminEmail"
                type="email"
                placeholder="familiar@email.com"
                className="pl-10"
                {...register('coadminEmail')}
              />
            </div>
            {errors.coadminEmail && (
              <p className="text-sm text-destructive">{errors.coadminEmail.message}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
