import express from 'express';
const app = express();
app.use(express.json());
import cors from 'cors';
app.use(cors());

import diagnoseRouter from './routes/diagnoses';
import patientRouter from './routes/patients';

const PORT = 3001;

app.get('/api/ping', (_req, res) => {
  res.send('pong');
});

app.use('/api/diagnoses', diagnoseRouter);
app.use('/api/patients', patientRouter);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});