import express from 'express';
import { calculateBmi, isNotNumber, calculateExercises } from "./utils";

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const { height, weight } = req.query;

  if ( !height || isNotNumber(height) || !weight || isNotNumber(weight)  ) {
    return res.send({ error: "malformatted parameters" });
  }

  const response = {
    weight:  Number(weight), 
    height: Number(height) ,
    bmi: calculateBmi(1,2)
  };

  return res.send(response);
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment 
  const { daily_exercises, target } = req.body;

  if ( !target || !daily_exercises ) {
    return res.send({ error: "parameters missing" });
  }

  if ( isNotNumber(target) ) {
    return res.send({ error: "malformatted parameters" });
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const days = daily_exercises as any[];

  for (const day of days) {
    if ( isNotNumber(day)) {
      return res.send({ error: "malformatted parameters" });
    }
  }

  const response = calculateExercises(days.map(d => Number(d)), Number(target));

  return res.send(response);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});