import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, Users, Stethoscope, ArrowRight, Zap, Shield, Bot } from 'lucide-react';
import { cn } from '@/lib/utils';
import { UserRole } from '@/types/diabetes';

const Index = () => {
  const navigate = useNavigate();
  const [selectedRole, setSelectedRole] = useState<UserRole | null>(null);

  const roles: { role: UserRole; label: string; description: string; icon: typeof Activity; color: string }[] = [
    {
      role: 'patient',
      label: 'Paciente',
      description: 'Registra y visualiza tus glucometrías, sueño, insulina y más.',
      icon: Activity,
      color: 'from-purple-600 to-purple-400'
    },
    {
      role: 'coadmin',
      label: 'Co-administrador',
      description: 'Acompaña a un paciente en su seguimiento diario.',
      icon: Users,
      color: 'from-info to-cyan-400'
    },
    {
      role: 'doctor',
      label: 'Médico',
      description: 'Gestiona pacientes con CRM inteligente e IA.',
      icon: Stethoscope,
      color: 'from-success to-emerald-400'
    }
  ];

  const handleContinue = () => {
    if (selectedRole) {
      navigate('/dashboard', { state: { role: selectedRole } });
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-32 w-96 h-96 bg-purple-600/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-purple-500/15 rounded-full blur-[128px]" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-700/10 rounded-full blur-[100px]" />
      </div>

      {/* Header */}
      <header className="relative z-10 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-purple flex items-center justify-center shadow-glow">
              <Activity className="w-6 h-6 text-foreground glow-icon" />
            </div>
            <div>
              <h1 className="font-bold text-lg text-foreground glow-text">DiabetesManager</h1>
              <span className="text-xs text-muted-foreground">Pro Edition</span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="max-w-4xl mx-auto text-center mb-12">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-purple-500/10 border border-purple-500/20 mb-6 animate-fade-up">
            <Bot className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-400">Potenciado por Shaun Murphy IA</span>
          </div>

          {/* Title */}
          <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-4 animate-fade-up stagger-1">
            Tu salud,{' '}
            <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent glow-text">
              bajo control
            </span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-8 animate-fade-up stagger-2">
            Plataforma inteligente para el seguimiento de diabetes con integración Telegram, 
            análisis de IA y CRM médico avanzado.
          </p>

          {/* Features */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-12 animate-fade-up stagger-3">
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
              <Zap className="w-4 h-4 text-warning" />
              <span className="text-sm text-muted-foreground">Tiempo real</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
              <Shield className="w-4 h-4 text-success" />
              <span className="text-sm text-muted-foreground">Datos seguros</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-secondary/50 border border-border/50">
              <Bot className="w-4 h-4 text-purple-400" />
              <span className="text-sm text-muted-foreground">Análisis IA</span>
            </div>
          </div>
        </div>

        {/* Role Selection */}
        <div className="w-full max-w-4xl mx-auto animate-fade-up stagger-4">
          <p className="text-center text-muted-foreground mb-6">
            Selecciona tu rol para continuar
          </p>
          
          <div className="grid md:grid-cols-3 gap-4 mb-8">
            {roles.map(({ role, label, description, icon: Icon, color }) => (
              <button
                key={role}
                onClick={() => setSelectedRole(role)}
                className={cn(
                  "glass-card glow-border p-6 text-left transition-all duration-300",
                  "hover:scale-[1.02] hover:shadow-glow-intense",
                  selectedRole === role && "ring-2 ring-purple-500 shadow-glow-intense"
                )}
              >
                <div className={cn(
                  "w-14 h-14 rounded-2xl flex items-center justify-center mb-4",
                  "bg-gradient-to-br shadow-glow",
                  color
                )}>
                  <Icon className="w-7 h-7 text-foreground" />
                </div>
                <h3 className="font-semibold text-lg text-foreground mb-2">{label}</h3>
                <p className="text-sm text-muted-foreground">{description}</p>
              </button>
            ))}
          </div>

          {/* Continue Button */}
          <div className="flex justify-center">
            <button
              onClick={handleContinue}
              disabled={!selectedRole}
              className={cn(
                "btn-neon flex items-center gap-2 px-8 py-4 text-lg",
                !selectedRole && "opacity-50 cursor-not-allowed"
              )}
            >
              Continuar
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 px-6 py-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-muted-foreground">
          <p>© 2024 DiabetesManager Pro</p>
          <p>Versión 1.0.0 - Beta</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
