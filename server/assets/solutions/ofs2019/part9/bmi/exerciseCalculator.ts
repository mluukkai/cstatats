interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number
}

export const calculateExercises = (hours: Array<number>, target: number): Result => {
  const getRating = (average: number, target: number) => {
    if (average == 0) return 0;
    if (average < target*0.75) return 1;
    if (average < target) return 2;

    return 3;
  };

  const sum = hours.reduce((s, h) => { return h + s; }, 0);
  const average = sum / hours.length;

  const ratings = {
    0: 'you did nothing, your lazy shit',
    1: 'leaves room to improve',
    2: 'not too bad but could be better',
    3: 'good job'
  };

  const rating = getRating(average, target);

  return { 
    periodLength: hours.length,
    trainingDays: hours.filter(h => h>0).length,
    success: average >= target,
    rating,
    ratingDescription: ratings[rating],
    target, 
    average 
  };
};

interface ParsedBmiParams {
  values: Array<number>;
  value: number;
}

const parseBmiArguments = (args: Array<string>): ParsedBmiParams => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const value = args[args.length-1];
  const values = args.splice(2, args.length-2);

  if (!isNaN(Number(value)) && !values.find(v => isNaN(Number(v))) ) {
    return {
      values: values.map(v => Number(v)),
      value: Number(value)
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

try {
  const { values , value } = parseBmiArguments(process.argv);
  const res = calculateExercises(values, value);
  console.log(res);
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  console.log('Error, something bad happened, message: ', e.message);
}