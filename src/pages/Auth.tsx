import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { PatientRegisterForm } from '@/components/auth/PatientRegisterForm';
import { LoginForm } from '@/components/auth/LoginForm';
import { Button } from '@/components/ui/button';
import { Activity, ArrowLeft } from 'lucide-react';

type AuthMode = 'login' | 'register';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const initialMode = searchParams.get('mode') === 'register' ? 'register' : 'login';
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="p-4 border-b border-border">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate('/')}
            className="gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </Button>
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <span className="font-semibold text-foreground">DiabetesManager</span>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          {/* Mode Toggle */}
          <div className="flex bg-muted rounded-lg p-1 mb-8">
            <Button
              type="button"
              variant={mode === 'login' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setMode('login')}
            >
              Iniciar Sesión
            </Button>
            <Button
              type="button"
              variant={mode === 'register' ? 'default' : 'ghost'}
              className="flex-1"
              onClick={() => setMode('register')}
            >
              Registrarse
            </Button>
          </div>

          {/* Form */}
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm">
            {mode === 'login' ? <LoginForm /> : <PatientRegisterForm />}
          </div>

          {/* Toggle link */}
          <p className="text-center text-sm text-muted-foreground mt-6">
            {mode === 'login' ? (
              <>
                ¿No tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('register')}
                  className="text-primary hover:underline font-medium"
                >
                  Regístrate aquí
                </button>
              </>
            ) : (
              <>
                ¿Ya tienes cuenta?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="text-primary hover:underline font-medium"
                >
                  Inicia sesión
                </button>
              </>
            )}
          </p>
        </div>
      </main>
    </div>
  );
};

export default Auth;
