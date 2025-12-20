import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';
import { getHomeRoute } from '@/lib/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, Phone, MessageCircle, Send, Monitor, 
  FileText, Clock, AlertTriangle, Check, Heart, 
  TrendingUp, Users, Building2, ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';

const Index = () => {
  const navigate = useNavigate();
  const { session, userRole, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && session && userRole) {
      const targetPath = getHomeRoute(userRole);
      navigate(targetPath, { replace: true });
    }
  }, [session, userRole, isLoading, navigate]);

  const handleLogin = () => navigate('/auth?mode=login');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-primary">Cargando...</div>
      </div>
    );
  }

  const scrollToSection = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-border">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold text-primary">Murphy</span>
          </div>
          
          <nav className="hidden md:flex items-center gap-6">
            <button onClick={() => scrollToSection('problema')} className="text-muted-foreground hover:text-primary transition-colors">
              Problema
            </button>
            <button onClick={() => scrollToSection('solucion')} className="text-muted-foreground hover:text-primary transition-colors">
              Solución
            </button>
            <button onClick={() => scrollToSection('beneficios')} className="text-muted-foreground hover:text-primary transition-colors">
              Beneficios
            </button>
            <button onClick={() => scrollToSection('contacto')} className="text-muted-foreground hover:text-primary transition-colors">
              Contacto
            </button>
          </nav>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={handleLogin} className="hidden sm:inline-flex">
            Iniciar Sesión
          </Button>
          <Button onClick={() => navigate('/auth?mode=register')} className="btn-neon">
            Registrarse
          </Button>
        </div>
        </div>
      </header>

      {/* Section 1: Video - Somos Murphy */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-fade-up">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              IA que acompaña la diabetes día a día
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Transforma el seguimiento en{" "}
              <span className="text-primary">acompañamiento real</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Murphy conecta a pacientes con diabetes y sus médicos a través de IA conversacional, 
              convirtiendo cada lectura de glucosa en datos clínicos accionables.
            </p>
          </div>

          {/* Video Embed */}
          <div className="glass-card p-2 rounded-2xl mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/CW45KAWD1UY"
                title="Murphy - Somos Murphy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">3M+</div>
              <div className="text-muted-foreground">Personas con diabetes en Colombia</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">&lt;50%</div>
              <div className="text-muted-foreground">Logra control estable de glucosa</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">24/7</div>
              <div className="text-muted-foreground">Acompañamiento inteligente</div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 2: Problema & Solución */}
      <section id="problema" className="py-20 px-4 bg-muted/30">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Problema */}
            <div className="space-y-6 animate-fade-up">
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">El problema real</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">
                  El seguimiento no debería depender de libretas
                </h2>
              </div>

              <div className="glass-card p-6">
                <p className="text-muted-foreground italic mb-4">
                  "Esta idea nació viendo a mi abuela luchar cada día con su diabetes avanzada: 
                  anotando glucometrías en papeles, olvidando lecturas, y esperando semanas 
                  para que su médico entendiera lo que pasaba."
                </p>
                <p className="text-primary font-medium">
                  ¿Cómo puede ser que en plena era digital el seguimiento dependa aún de una libreta?
                </p>
              </div>

              <div className="space-y-4">
                <ProblemItem icon={<FileText />} title="Falta de seguimiento continuo" description="Los pacientes registran datos de forma inconsistente y en papel" />
                <ProblemItem icon={<MessageCircle />} title="Comunicación fragmentada" description="Meses de espera entre citas sin visibilidad del estado del paciente" />
                <ProblemItem icon={<Clock />} title="Decisiones tardías" description="Complicaciones costosas y pérdida de calidad de vida" />
              </div>
            </div>

            {/* Solución */}
            <div id="solucion" className="space-y-6 animate-fade-up" style={{ animationDelay: '0.1s' }}>
              <div>
                <span className="text-primary font-semibold text-sm uppercase tracking-wider">Cómo funciona Murphy</span>
                <h2 className="text-3xl md:text-4xl font-bold mt-2">
                  Un agente de IA que te acompaña
                </h2>
              </div>

              <div className="space-y-4">
                <StepCard number={1} title="Registro Natural" description="Registra tu glucometría por WhatsApp, llamada telefónica o dashboard web" />
                <StepCard number={2} title="Análisis Inteligente" description="Murphy analiza patrones, identifica riesgos y genera insights clínicos automáticamente" />
                <StepCard number={3} title="Integración Médica" description="Reportes automáticos al sistema de la IPS (FHIR/HL7) para decisiones clínicas precisas" />
              </div>

              <div className="glass-card p-5">
                <p className="text-sm font-medium mb-3">Múltiples canales, cero fricción</p>
                <div className="grid grid-cols-4 gap-3">
                  <ChannelCard icon={<Phone />} label="Llamadas" />
                  <ChannelCard icon={<MessageCircle />} label="WhatsApp" />
                  <ChannelCard icon={<Send />} label="Telegram" />
                  <ChannelCard icon={<Monitor />} label="Dashboard" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Section 3: Beneficios para Todos */}
      <section id="beneficios" className="py-20 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12 animate-fade-up">Beneficios para todos</h2>

          <Tabs defaultValue="pacientes" className="animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <TabsList className="grid w-full grid-cols-3 mb-8">
              <TabsTrigger value="pacientes" className="flex items-center gap-2">
                <Heart className="h-4 w-4" />
                Pacientes
              </TabsTrigger>
              <TabsTrigger value="medicos" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Médicos
              </TabsTrigger>
              <TabsTrigger value="ips" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                IPS
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pacientes" className="glass-card p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <BenefitItem icon={<Heart />} title="Acompañamiento continuo" description="Nunca más sentirse solo frente a la enfermedad" />
                <BenefitItem icon={<TrendingUp />} title="Educación personalizada" description="Murphy educa y motiva según tu contexto" />
                <BenefitItem icon={<AlertTriangle />} title="Alertas tempranas" description="Detección proactiva de situaciones de riesgo" />
                <BenefitItem icon={<Check />} title="Sin complicaciones técnicas" description="Usa los canales que ya conoces y confías" />
              </div>
            </TabsContent>

            <TabsContent value="medicos" className="glass-card p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <BenefitItem icon={<TrendingUp />} title="Visibilidad completa" description="Ve la evolución real entre consultas" />
                <BenefitItem icon={<Activity />} title="Decisiones precisas" description="Datos estructurados y análisis de tendencias" />
                <BenefitItem icon={<FileText />} title="Integración nativa" description="Datos directos en tu sistema FHIR/HL7" />
                <BenefitItem icon={<AlertTriangle />} title="Alertas inteligentes" description="Notificaciones solo cuando realmente importa" />
              </div>
            </TabsContent>

            <TabsContent value="ips" className="glass-card p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <BenefitItem icon={<TrendingUp />} title="Mejores indicadores" description="Control metabólico y adherencia medibles" />
                <BenefitItem icon={<Activity />} title="Reducción de costos" description="Menos urgencias y hospitalizaciones" />
                <BenefitItem icon={<FileText />} title="Datos valiosos" description="Métricas clínicas y económicas en tiempo real" />
                <BenefitItem icon={<Users />} title="Escalabilidad" description="Atiende más pacientes con mejor calidad" />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </section>

      {/* Section 4: Agendar Demo */}
      <section id="contacto" className="py-20 px-4 bg-gradient-to-br from-primary/20 via-primary/10 to-background">
        <div className="container mx-auto max-w-3xl text-center animate-fade-up">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Murphy es más que tecnología</h2>
          <p className="text-xl text-primary font-medium mb-6">Es acompañamiento que salva vidas</p>
          <p className="text-muted-foreground mb-8">
            ¿Listo para transformar el seguimiento de diabetes? Buscamos IPS aliadas, inversores y mentores clínicos para escalar este impacto.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button asChild size="lg" className="btn-neon">
              <a href="mailto:contacto@murphy.health">
                Agendar Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </a>
            </Button>
            <Button asChild variant="outline" size="lg">
              <a href="https://wa.me/573001234567" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="mr-2 h-4 w-4" />
                Contactar por WhatsApp
              </a>
            </Button>
          </div>

          <div className="glass-card p-6 inline-block">
            <p className="text-sm text-muted-foreground mb-2">
              Cofundadores: <span className="text-foreground">Jhonattan Rodríguez, Adriana Gallo & Santiago Botero</span>
            </p>
            <p className="text-primary font-medium">Ningún paciente debería sentirse solo frente a su enfermedad</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">Murphy</span>
          </div>
          <p className="text-muted-foreground text-sm">Acompañamiento inteligente para la diabetes</p>
          <p className="text-muted-foreground text-sm">© 2025 Murphy Health. Todos los derechos reservados.</p>
        </div>
      </footer>
    </div>
  );
};

const ProblemItem = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-start gap-4">
    <div className="p-2 rounded-lg bg-destructive/10 text-destructive shrink-0">{icon}</div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

const StepCard = ({ number, title, description }: { number: number; title: string; description: string }) => (
  <div className="glass-card p-5 flex items-start gap-4">
    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground font-bold shrink-0">
      {number}
    </div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

const ChannelCard = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
  <div className="flex flex-col items-center gap-2 p-3 rounded-lg bg-background/50">
    <div className="text-primary">{icon}</div>
    <span className="text-xs text-muted-foreground">{label}</span>
  </div>
);

const BenefitItem = ({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) => (
  <div className="flex items-start gap-3">
    <div className="p-2 rounded-lg bg-primary/10 text-primary shrink-0">{icon}</div>
    <div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-muted-foreground text-sm">{description}</p>
    </div>
  </div>
);

export default Index;
