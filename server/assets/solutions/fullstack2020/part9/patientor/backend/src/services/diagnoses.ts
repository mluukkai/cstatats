import { Diagnosis } from '../types';
import diagnoses from '../../data/diagnoses';

const getAll = () : Array<Diagnosis> => {
  return diagnoses;
};

export default {
  getAll
};