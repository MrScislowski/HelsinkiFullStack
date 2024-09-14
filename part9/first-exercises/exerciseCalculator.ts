import { parseNumber, parseNumberArray, parseRequestBody } from "./utils";

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

interface ExerciseCalculatorInput {
  exerciseLog: number[];
  target: number;
}

export const parseRequestBodyExerciseData = (
  possibleBody: unknown
): ExerciseCalculatorInput => {
  const body = parseRequestBody(possibleBody);

  if (!(body && "target" in body && "daily_exercises" in body)) {
    throw new Error("parameters missing");
  }

  try {
    const target = parseNumber(body.target);
    const exerciseLog = parseNumberArray(body.daily_exercises);

    return { target, exerciseLog };
  } catch (_e) {
    throw new Error("malformatted parameters");
  }
};

const parseCommandLineExerciseData = (
  args: string[]
): ExerciseCalculatorInput => {
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

export const calculateExercises = (data: ExerciseCalculatorInput): Result => {
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

if (require.main === module) {
  try {
    const result = calculateExercises(
      parseCommandLineExerciseData(process.argv)
    );
    console.log(result);
  } catch (error: unknown) {
    let message = "Error occurred\n";
    if (error instanceof Error) {
      message += error.message;
    }
    console.log(message);
  }
}
