type BMICategory =
  | "Underweight (Severe thinness)"
  | "Underweight (Moderate thinness)"
  | "Underweight (Mild thinness)"
  | "Normal range"
  | "Overweight (Pre-obese)"
  | "Obese (Class I)"
  | "Obese (Class II)"
  | "Obese (Class III)";

export const calculateBMI = (
  heightInCm: number,
  weightInKg: number
): BMICategory => {
  const bmi = weightInKg / (heightInCm / 100) ** 2;
  if (bmi < 16.0) return "Underweight (Severe thinness)";
  else if (bmi <= 16.9) return "Underweight (Moderate thinness)";
  else if (bmi <= 18.4) return "Underweight (Mild thinness)";
  else if (bmi <= 24.9) return "Normal range";
  else if (bmi <= 29.9) return "Overweight (Pre-obese)";
  else if (bmi <= 34.9) return "Obese (Class I)";
  else if (bmi <= 39.9) return "Obese (Class II)";
  else if (bmi >= 40.0) return "Obese (Class III)";
  else throw new Error(`unknown bmi ${bmi}`);
};

// try {
//   const height = Number(process.argv[2]);
//   if (isNaN(height) || height == 0) {
//     throw new Error("height must be a nonzero number");
//   }

//   const weight = Number(process.argv[3]);
//   if (isNaN(weight)) {
//     throw new Error("weight must be a number");
//   }

//   console.log(calculateBMI(height, weight));
// } catch (error: unknown) {
//   let errorMessage = "An error occurred. ";
//   if (error instanceof Error) {
//     errorMessage += "Details: " + error.message;
//   }
//   console.log(errorMessage);
// }
