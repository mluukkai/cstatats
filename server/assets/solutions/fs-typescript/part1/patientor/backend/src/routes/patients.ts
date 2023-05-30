import express from 'express';
import patientsService from '../services/patientsService';
import { parsePatient, parseEntry } from '../utils';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getAllWithoutSsn());
});

router.get('/:id', (req, res) => {
  const id = req.params.id ;
  res.send(patientsService.getOne(id));
});

router.post('/', (req, res) => {
  try {
    const newPatient = parsePatient(req.body);
    const addedPatient = patientsService.create(newPatient);
    res.send(addedPatient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }

});

router.post('/:id/entries', (req, res) => {
  try {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const newEntry = parseEntry(req.body);
    const patient = patientsService.addEntry(req.params.id, newEntry);
    res.send(patient);
  } catch (error: unknown) {
    let errorMessage = 'Something went wrong.';
    if (error instanceof Error) {
      errorMessage += ' Error: ' + error.message;
    }
    res.status(400).send(errorMessage);
  }
});

export default router;