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

export const parseBmiParams = (
  params: Record<string, unknown>
): BmiInputData => {
  if (!("weight" in params && "height" in params)) {
    throw new Error(
      `Requires 'weight' and 'height' query params. Received ${Object.keys(
        params
      ).join(",")}`
    );
  }

  const parsedParams: { [key: string]: number } = {};

  Object.entries(params).forEach(([key, value]) => {
    if (isNaN(Number(value))) {
      throw new Error(`${key} was required to be a number, but was '${value}'`);
    }
    parsedParams[key] = Number(value);
  });

  const { height, weight } = parsedParams;

  return {
    height,
    weight,
  };
};

export const calculateBmi = (data: BmiInputData): string => {
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

if (require.main === module) {
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
}
