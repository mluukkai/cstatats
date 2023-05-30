import { isNotNumber, calculateBmi } from "./utils";

const args = process.argv;

if (args.length < 4 || args.length > 4) {
  throw new Error('Wrong number of arguments');
}

if (isNotNumber(args[2]) || isNotNumber(args[3])) {
  throw new Error('Argumets should be numbers');
}

const heigth = Number(args[2]);
const weigth = Number(args[3]);

const bmi = calculateBmi(heigth, weigth);

console.log(bmi);