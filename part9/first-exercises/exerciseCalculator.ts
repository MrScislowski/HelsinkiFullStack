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

const calculateExercises = (exerciseLog: number[], target: number): Result => {
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

console.log(calculateExercises([3, 0, 2, 4.5, 0, 3, 1], 2));
