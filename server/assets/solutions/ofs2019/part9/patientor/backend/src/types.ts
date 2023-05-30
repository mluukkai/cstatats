export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = 'male',
  Female = 'female',
  Other = 'other'
}

export type DiagnosisCodes = Array<Diagnosis['code']>;

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: DiagnosisCodes;
}

enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}

export interface OccupationalHealthCareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  sickLeave?: SickLeave;
  employerName: string;
} 

export interface Discharge {
  criteria: string;
  date: string;
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge?: Discharge;
}

export type Entry = HealthCheckEntry | OccupationalHealthCareEntry | HospitalEntry;

export type NewBaseEntry = Omit<BaseEntry, 'id'>;
export type NewHealthCheckEntry = Omit<HealthCheckEntry, 'id'>;
export type NewOccupationalHealthCareEntry = Omit<OccupationalHealthCareEntry, 'id'>;
export type NewHospitalEntry= Omit<HospitalEntry, 'id'>;
export type NewEntry = NewHealthCheckEntry | NewOccupationalHealthCareEntry | NewHospitalEntry;

export interface Patient {
  id: string;
  ssn: string;
  name: string;
  occupation: string;
  dateOfBirth: string
  gender: Gender;
  entries: Entry[]
}

export type PatientPublic = Omit<Patient, 'ssn' | 'entries'>;

export type PatientNew = Omit<Patient, 'id'>;