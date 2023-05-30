import express from 'express';
import patients from '../services/patients';
import { toNewPatient, toNewEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patients.getAll());
});

router.get('/:id', (req, res) => {
  const { id } = req.params;
  res.send(patients.getOne(id));
});

router.post('/', (req, res) => {
  try {
    const newPatient = toNewPatient(req.body);

    const addedPatient = patients.addPatient(newPatient);
    res.json(addedPatient);
  } catch (e) {
    res.status(400).send(e.message);
  }
});

router.post('/:id/entries', (req, res) => {
  try {
    const { id } = req.params;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newEntry = toNewEntry(req.body);
    const patient = patients.addEntry(id, newEntry);

    res.send(patient);
  } catch(e) {
    res.status(400).send(e.message);
  }
});

export default router;