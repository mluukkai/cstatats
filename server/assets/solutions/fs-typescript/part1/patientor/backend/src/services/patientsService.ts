import patients from '../../data/patients';
import { v1 as uuid } from 'uuid';
import { NonSensitivePatient, Patient, NewPatient, EntryWithoutId } from '../types';


const getAllWithoutSsn = (): NonSensitivePatient[] => {
  return patients.map((patient) => ({
    ... patient, ssn: undefined
  }));
};

const getOne = (id: string): Patient | undefined => {
  return patients.find(p => p.id === id);
};

const addEntry = (id: string, newEntry: EntryWithoutId): Patient | undefined => {
  const patient = patients.find(p => p.id === id);
  console.log(newEntry);

  if ( patient ) {
    const entry = {
      ...newEntry,
      id: uuid()
    };
    patient.entries = patient.entries.concat(entry);
  }

  return patient;
};

const create = (patient: NewPatient): Patient => {
  const newPatient = {
    ...patient,
    id: uuid()
  };

  return newPatient;
};

export default {
  getAllWithoutSsn,
  create,
  getOne,
  addEntry
};
