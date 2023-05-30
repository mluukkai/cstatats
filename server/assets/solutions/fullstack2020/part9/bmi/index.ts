/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import express from 'express';
const app = express();
app.use(express.json());

import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { weigth, height } = req.query;

  if (isNaN(Number(weigth)) || isNaN(Number(height))) {
    return res.send({ error: "malformatted parameters" });
  }

  const bmi = calculateBmi(Number(height), Number(weigth));

  return res.send({
    weigth, height, bmi
  });
});

app.post('/exercises', (req, res) => {
  if (!req.body.target || !req.body.daily_exercises) {
    return res.send({
      error: "parameters missing"
    });
  }

  const target = Number(req.body.target);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const daily_exercises: Array<any> = req.body.daily_exercises;

  if (isNaN(target) || daily_exercises.find(v => isNaN(Number(v)))) {
    return res.send({
      error: "malformatted parameters"
    });
  }

  console.log(daily_exercises.map(v => Number(v)), target );
  const response = calculateExercises([1], 1);

  return res.send(response);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});