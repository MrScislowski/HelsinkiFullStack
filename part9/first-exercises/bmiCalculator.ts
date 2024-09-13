import { parseNumber } from "./utils";

interface BmiInputData {
  height: number;
  weight: number;
}

const parseBmiArguments = (args: string[]): BmiInputData => {
  if (args.length !== 4) {
    throw new Error(`${args.length - 2} arguments provided... expected 2`);
  }

  const [height, weight] = args.slice(2).map(parseNumber);

  return {
    height,
    weight,
  };
};

const calculateBmi = (data: BmiInputData): string => {
  const { weight, height } = data;
  const heightInM = height / 100;
  const bmi = weight / Math.pow(heightInM, 2);

  let description;
  if (bmi < 18.5) description = "underweight";
  else if (bmi < 25) description = "normal range";
  else if (bmi < 30) description = "overweight";
  else description = "obese";

  return description;
};

try {
  const result = calculateBmi(parseBmiArguments(process.argv));
  console.log(result);
} catch (error: unknown) {
  let errorMessage = "Error occurred: ";
  if (error instanceof Error) {
    errorMessage += error.message;
  }
  console.log(errorMessage);
}
