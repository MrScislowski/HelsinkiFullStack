import { parseNumber } from "./utils";

type Rating = 1 | 2 | 3;

type RatingDescription = "not even close" | "almost there" | "you did it!";

interface Result {
  periodLength: number;
  trainingDays: number;
  target: number;
  average: number;
  success: boolean;
  rating: Rating;
  ratingDescription: RatingDescription;
}

interface BmiCalculatorInput {
  exerciseLog: number[];
  target: number;
}

const parseBmiCalculatorInput = (args: string[]): BmiCalculatorInput => {
  if (args.length < 4) {
    throw new Error(
      `Expected 2+ arguments (a target, then one or more training hours representing days). Receieved ${
        args.length - 2
      }`
    );
  }

  const target = parseNumber(args[2]);
  const exerciseLog = args.slice(3).map(parseNumber);
  return {
    target,
    exerciseLog,
  };
};

const calculateExercises = (data: BmiCalculatorInput): Result => {
  const { exerciseLog, target } = data;

  const periodLength = exerciseLog.length;
  const trainingDays = exerciseLog.reduce(
    (total, hours) => (hours === 0 ? total : total + 1),
    0
  );
  const totalHours = exerciseLog.reduce((total, hours) => total + hours, 0);
  const average = totalHours / periodLength;
  let rating: Rating;
  let ratingDescription: RatingDescription;
  if (average < 0.5 * target) {
    rating = 1;
    ratingDescription = "not even close";
  } else if (average < target) {
    rating = 2;
    ratingDescription = "almost there";
  } else {
    rating = 3;
    ratingDescription = "you did it!";
  }

  return {
    periodLength,
    trainingDays,
    target,
    average,
    success: average >= target,
    rating,
    ratingDescription,
  };
};

try {
  const result = calculateExercises(parseBmiCalculatorInput(process.argv));
  console.log(result);
} catch (error: unknown) {
  let message = "Error occurred\n";
  if (error instanceof Error) {
    message += error.message;
  }
  console.log(message);
}
