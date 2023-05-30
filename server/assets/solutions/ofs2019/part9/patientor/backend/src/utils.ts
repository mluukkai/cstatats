import {
  PatientNew, Gender, 
  NewHealthCheckEntry, NewOccupationalHealthCareEntry, NewHospitalEntry, NewEntry, NewBaseEntry,
  DiagnosisCodes, SickLeave, Discharge
} from './types';

const isString = (text: unknown): text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isNumber = (value: unknown): value is number => {
  return typeof value === 'number';
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isArray = (value: unknown): boolean => {
  return Array.isArray(value);
};

const parseNumberField = (value: unknown, field: string): number => {
  if (value===undefined || !isNumber(value)) {
    throw new Error('Incorrect or missing '+ field);
  }

  return value;
};

const parseStringField = (value: unknown, field: string): string => {
  if (!value || !isString(value)) {
    throw new Error('Incorrect or missing '+ field);
  }

  return value;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const isGender = (value: any): value is Gender => {
  return Object.values(Gender).includes(value);
};

const parseGender = (value: unknown): Gender => {
  if (!value || !isGender(value) ) {
    throw new Error('Incorrect or missing gender');
  }

  return value;
};

const parseDateField = (value: unknown, field: string ): string => {
  if (!value || !isString(value) || !isDate(value)) {
    throw new Error('Incorrect or missing ' + field);
  }

  return value;
};

const parseDiagnosisCodes = (value: unknown): DiagnosisCodes | undefined => {
  if (!value) {
    return undefined;
  }

  if (!isArray(value) ) {
    throw new Error('Incorrect diagnosisCodes');
  }

  if ((value as Array<unknown>).find( a => !isString(a) ) ){
    throw new Error('Incorrect diagnosisCodes');
  }

  return value as DiagnosisCodes;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseSickLeave = (value: any): SickLeave | undefined => {
  if (!value) {
    return undefined;
  }

  if (!value.startDate || !value.endDate || !isDate(value.startDate) || !isDate(value.endDate)) {
    throw new Error('Incorrect sickLeave');
  }

  return value as SickLeave;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const parseDischarge = (value: any): Discharge | undefined => {
  if (!value) {
    return undefined;
  }

  if (!value.date || !value.criteria || !isDate(value.date) || !isString(value.criteria)) {
    throw new Error('Incorrect discharge');
  }

  return value as Discharge;
};


type PatientBody = { 
  name : unknown, ssn: unknown, occupation: unknown, dateOfBirth: unknown, gender: unknown
};

export const toNewPatient = ({ name, ssn, occupation, gender, dateOfBirth } : PatientBody): PatientNew => {
  const newPatient: PatientNew = {
    ssn: parseStringField(ssn, 'ssn'),
    name: parseStringField(name, 'name'),
    occupation: parseStringField(occupation, 'occupation'),
    dateOfBirth: parseDateField(dateOfBirth, 'dateOfBirth'),
    gender: parseGender(gender),
    entries: []
  };

  return newPatient;
};

interface BaseEntryBody {
  date: unknown;
  specialist: unknown;
  description: unknown;  
  diagnosisCodes?: unknown;
}

interface HealthCheckBody extends BaseEntryBody {
  healthCheckRating: unknown;
}

interface OccupationalHealthcareBody extends BaseEntryBody {
  employerName: unknown;
  sickLeave?: unknown;
}

interface HospitalEntryBody extends BaseEntryBody {
  discharge?: unknown;
}

const parseEntryBase = ({ date, specialist, description, diagnosisCodes } :BaseEntryBody ): NewBaseEntry => {
  return {
    date: parseDateField(date, 'date'), 
    specialist: parseStringField(specialist, 'specialist'), 
    description: parseStringField(description, 'description'),
    diagnosisCodes: parseDiagnosisCodes(diagnosisCodes),  
  };
};

const toHealthCheckEntry = ({
  date, specialist, description, diagnosisCodes, healthCheckRating
  } :HealthCheckBody ): NewHealthCheckEntry => {
    return {
      ...parseEntryBase({ date, specialist, description, diagnosisCodes }),
      type: "HealthCheck",
      healthCheckRating: parseNumberField(healthCheckRating, 'healthCheckRating'),
    };
};

const toOccupationalHealthcareEntry = ({
  date, specialist, description, diagnosisCodes, sickLeave, employerName
  } :OccupationalHealthcareBody ): NewOccupationalHealthCareEntry => {
    return {
      ...parseEntryBase({ date, specialist, description, diagnosisCodes }),
      type: "OccupationalHealthcare",
      employerName: parseStringField(employerName, 'employerName'), 
      sickLeave: parseSickLeave(sickLeave)
    };
};

const toHospitalEntry = ({
  date, specialist, description, diagnosisCodes, discharge
  } :HospitalEntryBody ): NewHospitalEntry => {
    return {
      ...parseEntryBase({ date, specialist, description, diagnosisCodes }),
      type: "Hospital",
      discharge: parseDischarge(discharge)
    };
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const toNewEntry = (body: any): NewEntry => {
  const type = body.type as string;
  if (type === 'HealthCheck') {
    return toHealthCheckEntry(body);
  } if (type === 'OccupationalHealthcare') {
    return toOccupationalHealthcareEntry(body);
  } else if (type === 'Hospital') {
    return toHospitalEntry(body);
  } 
  
  throw new Error("wrong entry type");
};