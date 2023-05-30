// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isNotNumber = (argument: any): boolean =>
  isNaN(Number(argument));

export const calculateBmi = (heigth: number, weigth: number): string => {
  const bmi = weigth / ((heigth / 100) * (heigth / 100));

  const limits = [
    { value: 16, type: "Underweight (Severe thinness)" },
    { value: 17, type: "Underweight (Moderate thinness)" },
    { value: 18.5, type: "Underweight (Mild thinness)" },
    { value: 25, type: "Normal range" },
    { value: 30, type: "Overweight (Pre-obese)" },
    { value: 35, type: "Obese (Class I)" },
    { value: 40, type: "Obese (Class II)" }
  ];

  for (const { value, type } of limits) {
    if (bmi < value) {
      return type;
    }
  }

  return "Obese (Class III)";
};

export interface ExerciseResult {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number 
}

const calculateRating = (target: number, average: number) => {
  if ( average<0.5*target) {
    return 1;
  }
  if ( average<1.2*target) {
    return 2;
  }

  return 3;
};

export const calculateExercises = (days: number[], target: number): ExerciseResult => {
  const descriptions = {
    1: 'you could do so much more, pls',
    2: 'not too bad but could be better',
    3: 'good job!'
  };

  const periodLength = days.length;
  const sum = days.reduce((s, d) => s+d);
  const average = sum / periodLength;
  const rating = calculateRating(target, average);
  
  return { 
    periodLength,
    trainingDays: days.filter(v => v > 0).length,
    success: average >= target,
    rating,
    ratingDescription: descriptions[rating],
    target,
    average
  };
};