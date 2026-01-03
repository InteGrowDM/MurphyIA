import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { getHomeRoute } from '@/lib/navigation';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Activity, Phone, MessageCircle, Monitor, 
  FileText, Clock, AlertTriangle, Check, Heart, 
  TrendingUp, Users, Building2, ArrowRight,
  Zap, Shield, LogIn, Calendar as CalendarIcon, Award
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { toast } from 'sonner';

const Index = () => {
  const navigate = useNavigate();
  const { session, userRole, isLoading } = useAuth();

  const [formData, setFormData] = useState({
    nombre: '',
    tipoUsuario: '',
    celular: '',
    email: '',
    fechaContacto: '',
    horaContacto: ''
  });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (!isLoading && session && userRole) {
      const targetPath = getHomeRoute(userRole);
      navigate(targetPath, { replace: true });
    }
  }, [session, userRole, isLoading, navigate]);

  const handleLogin = () => navigate('/auth?mode=login');

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.tipoUsuario || !formData.celular || !formData.email) {
      toast.error('Por favor completa todos los campos requeridos');
      return;
    }
    setFormSubmitted(true);
    toast.success('¡Solicitud enviada! Te contactaremos pronto.');
  };

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
          <Button onClick={() => scrollToSection('contacto')} className="btn-neon">
            Agendar Demo
          </Button>
        </div>
        </div>
      </header>

      {/* Hero Auth Section */}
      <section className="min-h-screen flex items-center justify-center px-4 pt-20">
        <div className="text-center max-w-3xl mx-auto animate-fade-up">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Tu salud, <span className="text-primary">bajo control</span>
          </h1>
          
          <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Sistema integrado con IA que permite el seguimiento de las glucometrías y mejora la vida de los pacientes con diabetes.
          </p>
          
          <div className="flex items-center justify-center gap-4 mb-10">
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <Zap className="h-4 w-4 text-primary" />
              Tiempo real
            </span>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-sm">
              <Shield className="h-4 w-4 text-primary" />
              Datos seguros
            </span>
          </div>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button 
              onClick={handleLogin}
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto min-w-[160px]"
            >
              <LogIn className="mr-2 h-4 w-4" />
              Iniciar Sesión
            </Button>
            <Button 
              onClick={() => scrollToSection('contacto')}
              size="lg"
              className="btn-neon w-full sm:w-auto min-w-[160px]"
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              Agendar Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Section 1: Video - Somos Murphy */}
      <section className="pt-32 pb-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <div className="text-center mb-12 animate-fade-up">
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Murphy acompaña la diabetes día a día
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Murphy es más que tecnología{" "}
              <span className="text-primary">es acompañamiento que salva vidas</span>
            </h1>
            {/* Video Embed */}
          <div className="glass-card p-2 rounded-2xl mb-12 animate-fade-up" style={{ animationDelay: '0.1s' }}>
            <div className="aspect-video rounded-xl overflow-hidden">
              <iframe
                src="https://www.youtube.com/embed/gZUBpbIfQrI"
                title="Murphy - Somos Murphy"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </div>
          </div>
            <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
              Murphy conecta a pacientes con diabetes y sus médicos a través de IA conversacional, 
              convirtiendo cada lectura de glucosa, insulina y bienestar en datos clínicos accionables.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fade-up" style={{ animationDelay: '0.2s' }}>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">3M+</div>
              <div className="text-muted-foreground">Personas con diabetes en Colombia</div>
            </div>
            <div className="glass-card p-6 text-center">
              <div className="text-3xl md:text-4xl font-bold text-primary mb-2">Pacientes</div>
              <div className="text-muted-foreground">Control estable de glucosa</div>
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
                  El seguimiento de las glucometrías no debería depender de cuadernos.
                </h2>
              </div>

              <div className="glass-card p-6">
                <p className="text-muted-foreground italic mb-4">
                  "Esta idea nació por experiencia de uno de los cofundadores, quien observó a su abuela luchar cada día con su diabetes avanzada: 
                  anotando glucometrías en cuadernos, olvidando lecturas, y esperando semanas 
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
                <StepCard number={1} title="Registro Natural" description="Registra tu glucometría, insulina, estrés, horas de sueño y mareos por WhatsApp, llamada telefónica o dashboard web" />
                <StepCard number={2} title="Análisis Inteligente" description="Murphy analiza patrones, identifica riesgos y genera insights clínicos automáticamente" />
                <StepCard number={3} title="Integración Médica" description="Reportes automáticos para los médicos especialistas en base a la información diaria del paciente" />
              </div>

              <div className="glass-card p-5">
                <p className="text-sm font-medium mb-3">Múltiples canales, cero fricción</p>
                <div className="grid grid-cols-3 gap-3">
                  <ChannelCard icon={<Phone />} label="Llamadas" />
                  <ChannelCard icon={<MessageCircle />} label="WhatsApp" />
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
              <TabsTrigger value="clinicas" className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                Clínicas
              </TabsTrigger>
            </TabsList>

            <TabsContent value="pacientes" className="glass-card p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <BenefitItem icon={<Heart />} title="Acompañamiento continuo" description="Nunca más sentirse solo frente a la enfermedad" />
                <BenefitItem icon={<TrendingUp />} title="Educación personalizada" description="Murphy es un copiloto en la educación y motivación del paciente y sus coadministradores" />
                <BenefitItem icon={<AlertTriangle />} title="Alertas tempranas" description="Detección proactiva de situaciones de riesgo" />
                <BenefitItem icon={<Check />} title="Sin complicaciones técnicas" description="Usa los canales que ya conoces y confías" />
              </div>
            </TabsContent>

            <TabsContent value="medicos" className="glass-card p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <BenefitItem icon={<TrendingUp />} title="Visibilidad completa" description="Ve la evolución real entre consultas" />
                <BenefitItem icon={<Activity />} title="Decisiones precisas" description="Datos estructurados y análisis de tendencias" />
                <BenefitItem icon={<AlertTriangle />} title="Alertas inteligentes" description="Notificaciones solo cuando realmente importa" />
                <BenefitItem icon={<Award />} title="Profesionalismo" description="Refleje su inversión en tecnología de vanguardia" />
              </div>
            </TabsContent>

            <TabsContent value="clinicas" className="glass-card p-6">
              <div className="grid sm:grid-cols-2 gap-4">
                <BenefitItem icon={<TrendingUp />} title="Mejores indicadores" description="Información de los pacientes en tiempo real" />
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
        <div className="container mx-auto max-w-2xl animate-fade-up">
          <div className="text-center mb-8">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Agendar Demo</h2>
            <p className="text-muted-foreground">
              Déjanos tus datos y te contactaremos para mostrarte cómo Murphy puede transformar el seguimiento de diabetes.
            </p>
          </div>

          {!formSubmitted ? (
            <form onSubmit={handleFormSubmit} className="glass-card p-6 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre completo *</Label>
                <Input
                  id="nombre"
                  placeholder="Tu nombre completo"
                  value={formData.nombre}
                  onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoUsuario">Tipo de usuario *</Label>
                <Select
                  value={formData.tipoUsuario}
                  onValueChange={(value) => setFormData({ ...formData, tipoUsuario: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona tu rol" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="paciente">Paciente</SelectItem>
                    <SelectItem value="coadministrador">Coadministrador</SelectItem>
                    <SelectItem value="medico">Médico</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="celular">Número de celular *</Label>
                <Input
                  id="celular"
                  type="tel"
                  placeholder="+57 300 123 4567"
                  value={formData.celular}
                  onChange={(e) => setFormData({ ...formData, celular: e.target.value })}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Correo electrónico *</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="tu@correo.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Día de contacto</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button 
                        variant="outline" 
                        className="w-full justify-start text-left font-normal"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fechaContacto 
                          ? format(new Date(formData.fechaContacto), "PPP", { locale: es }) 
                          : "Selecciona un día"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={formData.fechaContacto ? new Date(formData.fechaContacto) : undefined}
                        onSelect={(date) => setFormData({ 
                          ...formData, 
                          fechaContacto: date ? format(date, 'yyyy-MM-dd') : '' 
                        })}
                        disabled={(date) => date < new Date()}
                        className="pointer-events-auto"
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-2">
                  <Label>Hora de contacto</Label>
                  <Select
                    value={formData.horaContacto}
                    onValueChange={(value) => setFormData({ ...formData, horaContacto: value })}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Selecciona una hora" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="09:00">9:00 AM</SelectItem>
                      <SelectItem value="10:00">10:00 AM</SelectItem>
                      <SelectItem value="11:00">11:00 AM</SelectItem>
                      <SelectItem value="12:00">12:00 PM</SelectItem>
                      <SelectItem value="14:00">2:00 PM</SelectItem>
                      <SelectItem value="15:00">3:00 PM</SelectItem>
                      <SelectItem value="16:00">4:00 PM</SelectItem>
                      <SelectItem value="17:00">5:00 PM</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Button type="submit" size="lg" className="btn-neon w-full">
                <CalendarIcon className="mr-2 h-4 w-4" />
                Enviar solicitud
              </Button>
            </form>
          ) : (
            <div className="glass-card p-8 text-center space-y-6">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/20 flex items-center justify-center">
                <Check className="h-8 w-8 text-primary" />
              </div>
              <div>
                <h3 className="text-xl font-bold mb-2">¡Gracias por tu interés!</h3>
                <p className="text-muted-foreground">
                  Hemos recibido tu solicitud. Te contactaremos pronto para agendar tu demo.
                </p>
              </div>
              <Button asChild size="lg" className="btn-neon">
                <a href="https://wa.me/573045818587" target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="mr-2 h-4 w-4" />
                  Contactar por WhatsApp
                </a>
              </Button>
            </div>
          )}

        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-border">
        <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Activity className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">Murphy</span>
          </div>
          <p className="text-muted-foreground text-sm">Acompañamiento integral para el control de la diabetes en pro de una mejor calidad de vida</p>
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
