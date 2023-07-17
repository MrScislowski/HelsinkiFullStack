interface ExerciseAnalysis {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: number;
  ratingDescription: string;
  target: number;
  average: number;
}

const calculateExercises = (
  dailyHours: number[],
  target: number
): ExerciseAnalysis => {
  const periodLength = dailyHours.length;
  const trainingDays = dailyHours.reduce(
    (dayCount, hours) => (hours == 0 ? dayCount : dayCount + 1),
    0
  );
  const average =
    dailyHours.reduce((hours, total) => total + hours, 0) / periodLength;
  const success = average >= target;
  let rating = 1;
  if (average * 2 >= target) rating = 2;
  if (success) rating = 3;
  let ratingDescription = "failure";
  if (rating == 2) ratingDescription = "near success";
  if (rating == 3) ratingDescription = "success";

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
};

try {
  //   const hourArray: number[] = process.argv.slice(2, -1);
  //   const target: number = process.argv.slice(-1)[0];
  if (isNaN(Number(process.argv[2])))
    throw new Error("target must be a number");
  const target: number = Number(process.argv[2]);

  for (let hourVal of process.argv.slice(3)) {
    if (isNaN(Number(hourVal))) throw new Error("daily hours must be numbers");
  }

  const hourArray: number[] = process.argv.slice(3).map((el) => Number(el));

  console.log(calculateExercises(hourArray, target));
} catch (error: unknown) {
  let errorMessage = "An error occurred. ";
  if (error instanceof Error) {
    errorMessage += "Details: " + error.message;
  }
  console.log(errorMessage);
}
