export interface Signature {
  id: string;
  book: string;
  page: string;
  name: string;
  date: string;
}

export interface DeedModel {
  id: string;
  title: string;
  type: 'folder' | 'file';
  subType?: string;
  content?: string;
}

export interface AnalysisResult {
  indisponibilidade: string;
  descricao: string;
  proprietarios: string;
}

export interface Appointment {
  id: string;
  date: string; // Format YYYY-MM-DD
  time: string; // Format HH:mm
  clientName: string;
  serviceType: string;
  notes?: string;
}

export enum UserRole {
  GUEST = 'guest',
  CLERK = 'clerk'
}