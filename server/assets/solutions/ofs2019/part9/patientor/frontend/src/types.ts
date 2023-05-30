export interface Diagnosis {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other"
}

interface BaseEntry {
  id: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnosis['code']>;
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3
}

export interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck";
  healthCheckRating: HealthCheckRating;
}

interface SickLeave {
  startDate: string;
  endDate: string;
}

export interface OccupationalHealthCareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  sickLeave?: SickLeave;
  employerName: string;
} 

interface Discharge {
  criteria: string;
  date: string;
}

export interface HospitalEntry extends BaseEntry {
  type: "Hospital";
  discharge?: Discharge;
}

export type Entry = HealthCheckEntry | OccupationalHealthCareEntry | HospitalEntry;

interface AllFormValues extends BaseEntry {
  type: string;
  discharge?: Discharge;
  sickLeave?: SickLeave;
  employerName?: string;
  healthCheckRating?: HealthCheckRating;
}

export type EntryFormValues = Omit<AllFormValues, 'id'>;
export interface Patient {
  id: string;
  name: string;
  occupation: string;
  gender: Gender;
  ssn?: string;
  dateOfBirth?: string;
  entries: Entry[];
}

export interface TypeOption {
  value: string,
  label: string
}
