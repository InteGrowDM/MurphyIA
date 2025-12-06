import { DashboardLayout } from '@/components/dashboard/DashboardLayout';
import { MessageCircle, Link2, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UserRole } from '@/types/diabetes';

export default function Telegram() {
  const userRole: UserRole = 'patient';
  
  return (
    <DashboardLayout userRole={userRole} userName="Carlos García">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Telegram</h1>
          <p className="text-muted-foreground mt-1">Conecta tu cuenta para recibir notificaciones</p>
        </div>
        
        <div className="glass-card p-6 text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-info/20 flex items-center justify-center mx-auto">
            <MessageCircle className="w-8 h-8 text-info" />
          </div>
          
          <div>
            <h2 className="text-lg font-semibold text-foreground">Conectar Telegram</h2>
            <p className="text-muted-foreground mt-2 max-w-md mx-auto">
              Recibe alertas de glucosa, recordatorios de medición y mensajes de tu co-administrador directamente en Telegram.
            </p>
          </div>
          
          <Button className="btn-neon">
            <Link2 className="w-4 h-4 mr-2" />
            Vincular cuenta
          </Button>
        </div>
      </div>
    </DashboardLayout>
  );
}
