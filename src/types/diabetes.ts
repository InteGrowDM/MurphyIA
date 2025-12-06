export type UserRole = 'patient' | 'coadmin' | 'doctor';

export type DiabetesType = 'Tipo 1' | 'Tipo 2' | 'Gestacional' | 'LADA' | 'MODY';

export type GlucometryType = 'fasting' | 'preprandial' | 'postprandial' | 'random' | 'nocturnal';

export type InsulinType = 'rapid' | 'short' | 'intermediate' | 'basal' | 'mixed';

export type AlertSeverity = 'info' | 'warning' | 'critical';

export type AlertType = 'hypoglycemia' | 'hyperglycemia' | 'missed_dose' | 'pattern' | 'streak' | 'reminder';

export interface Glucometry {
  id: string;
  value: number;
  timestamp: string;
  type: GlucometryType;
  notes?: string;
}

export interface InsulinDose {
  id: string;
  units: number;
  type: InsulinType;
  timestamp: string;
  notes?: string;
}

export interface SleepRecord {
  id: string;
  hours: number;
  quality: number; // 1-10
  date: string;
}

export interface StressRecord {
  id: string;
  level: number; // 1-10
  timestamp: string;
  notes?: string;
}

export interface Alert {
  id: string;
  type: AlertType;
  severity: AlertSeverity;
  message: string;
  timestamp: string;
  resolved: boolean;
}

export interface Patient {
  id: string;
  name: string;
  age: number;
  diabetesType: DiabetesType;
  estrato: number;
  avatar: string | null;
  telegramConnected: boolean;
  coadminId: string | null;
  doctorId: string;
  xpLevel: number;
  streak: number;
  glucometrias: Glucometry[];
  insulina: InsulinDose[];
  sueno: SleepRecord[];
  estres: StressRecord[];
  alertas: Alert[];
}

export interface Coadmin {
  id: string;
  name: string;
  patientId: string;
  telegramConnected: boolean;
}

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  patientCount: number;
}

export interface AIReportSummary {
  avgGlucose: number;
  stdDev: number;
  hypoCount: number;
  hyperCount: number;
  timeInRange: number;
  trend: 'improving' | 'stable' | 'deteriorating';
}

export interface AIReport {
  id: string;
  patientId: string;
  generatedAt: string;
  summary: AIReportSummary;
  recommendations: string[];
  pdfUrl?: string;
}

export interface MockData {
  patients: Patient[];
  coadmins: Coadmin[];
  doctors: Doctor[];
  aiReports: AIReport[];
}
