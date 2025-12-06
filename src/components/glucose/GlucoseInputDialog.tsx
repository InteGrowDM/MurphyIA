import { useState, useEffect, useRef } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { GlucometryType, GLUCOMETRY_LABELS, getGlucoseStatus, GLUCOSE_RANGES } from '@/types/diabetes';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface GlucoseInputDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: GlucometryType;
  initialValue?: number;
  onSave: (value: number, notes?: string) => void;
}

export function GlucoseInputDialog({
  open,
  onOpenChange,
  type,
  initialValue,
  onSave,
}: GlucoseInputDialogProps) {
  const [value, setValue] = useState<string>(initialValue?.toString() || '');
  const [notes, setNotes] = useState('');
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setValue(initialValue?.toString() || '');
      setNotes('');
      setError(null);
      // Focus input after a small delay for animation
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [open, initialValue]);

  const numericValue = parseInt(value, 10);
  const isValid = !isNaN(numericValue) && numericValue >= 20 && numericValue <= 600;
  const status = isValid ? getGlucoseStatus(numericValue) : null;

  const handleSubmit = () => {
    if (!value.trim()) {
      setError('Ingresa un valor');
      return;
    }

    if (!isValid) {
      setError('El valor debe estar entre 20 y 600 mg/dL');
      return;
    }

    onSave(numericValue, notes.trim() || undefined);
    onOpenChange(false);
  };

  const statusColors = {
    critical_low: 'text-destructive border-destructive/50',
    low: 'text-warning border-warning/50',
    normal: 'text-success border-success/50',
    high: 'text-warning border-warning/50',
    critical_high: 'text-destructive border-destructive/50',
  };

  const statusMessages = {
    critical_low: 'Hipoglucemia severa - Busca atención',
    low: 'Glucosa baja',
    normal: 'En rango normal',
    high: 'Glucosa elevada',
    critical_high: 'Hiperglucemia severa',
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[360px] bg-card border-border/50">
        <DialogHeader>
          <DialogTitle className="text-foreground">
            {GLUCOMETRY_LABELS[type]}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {/* Value Input */}
          <div className="space-y-2">
            <Label htmlFor="glucose-value" className="text-muted-foreground">
              Valor de glucosa
            </Label>
            <div className="relative">
              <Input
                ref={inputRef}
                id="glucose-value"
                type="number"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="120"
                value={value}
                onChange={(e) => {
                  setValue(e.target.value);
                  setError(null);
                }}
                className={cn(
                  "text-hig-2xl font-bold text-center h-16 pr-16",
                  isValid && status ? statusColors[status] : "",
                  error ? "border-destructive" : ""
                )}
                min={20}
                max={600}
                aria-describedby="glucose-unit glucose-status"
              />
              <span 
                id="glucose-unit"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground text-hig-sm"
              >
                mg/dL
              </span>
            </div>
            
            {/* Status indicator */}
            {isValid && status && (
              <div 
                id="glucose-status"
                className={cn(
                  "flex items-center gap-2 p-2 rounded-hig",
                  status === 'normal' ? "bg-success/10" : "bg-warning/10"
                )}
                role="status"
              >
                {status === 'normal' ? (
                  <CheckCircle2 className="w-4 h-4 text-success" />
                ) : (
                  <AlertTriangle className="w-4 h-4 text-warning" />
                )}
                <span className={cn(
                  "text-hig-xs",
                  status === 'normal' ? "text-success" : "text-warning"
                )}>
                  {statusMessages[status]}
                </span>
              </div>
            )}

            {/* Error message */}
            {error && (
              <p className="text-hig-xs text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>

          {/* Notes Input */}
          <div className="space-y-2">
            <Label htmlFor="glucose-notes" className="text-muted-foreground">
              Notas (opcional)
            </Label>
            <Textarea
              id="glucose-notes"
              placeholder="Ej: Después de ejercicio..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="resize-none h-20"
              maxLength={200}
            />
          </div>

          {/* Quick reference */}
          <div className="text-hig-xs text-muted-foreground space-y-1 pt-2 border-t border-border/30">
            <p>Rangos de referencia:</p>
            <ul className="grid grid-cols-2 gap-1">
              <li className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span>&lt;{GLUCOSE_RANGES.low} mg/dL Bajo</span>
              </li>
              <li className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-success" />
                <span>{GLUCOSE_RANGES.low}-{GLUCOSE_RANGES.high} Normal</span>
              </li>
              <li className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-warning" />
                <span>&gt;{GLUCOSE_RANGES.high} Alto</span>
              </li>
              <li className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-destructive" />
                <span>&gt;{GLUCOSE_RANGES.critical_high} Crítico</span>
              </li>
            </ul>
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-none"
          >
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={!value.trim()}
            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90"
          >
            Guardar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
