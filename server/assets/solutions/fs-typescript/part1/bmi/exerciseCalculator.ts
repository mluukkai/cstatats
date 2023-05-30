import { isNotNumber, calculateExercises } from "./utils";

const args = process.argv;

if (args.length < 4) {
  throw new Error('Too few arguments');
}

const argTarget = args[2];

if ( isNotNumber(argTarget) ) {
  throw new Error('Argumets should be numbers');
}

const target = Number(argTarget);

const argDays = args.slice(3);

for (const dayArg of argDays) {
  if ( isNotNumber(dayArg) ) {
    throw new Error('Argumets should be numbers');
  }
}

const days = argDays.map(d => Number(d));

const result = calculateExercises(days, target);
console.log(result);
