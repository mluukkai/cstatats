export const calculateBmi = (heigth: number, weight: number): string => {
  const bmi =  weight / (heigth / 100 * heigth / 100)
  
  if (bmi < 15) {
    return 'Very severely underweight'
  }
  if (bmi < 16) {
    return 'Severely underweight'
  }
  if (bmi < 18.5) {
    return 'Severely underweight'
  }
  if (bmi < 25) {
    return 'Normal (healthy weight)'
  }
  if (bmi < 30) {
    return 'Overweight'
  }

  return 'Obese'
}

export interface ParsedParams {
  value1: number;
  value2: number;
}

const parseArguments = (args: Array<string>): ParsedParams => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    return {
      value1: Number(args[2]),
      value2: Number(args[3])
    }
  } else {
    throw new Error('Provided values were not numbers!');
  }
}

try {
  const { value1: heigth , value2: weight } = parseArguments(process.argv);
  console.log(calculateBmi(heigth, weight))
} catch (e) {
  console.log('Error, something bad happened, message: ', e.message);
}