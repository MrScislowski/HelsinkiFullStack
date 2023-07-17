type BMICategory =
  | "Underweight (Severe thinness)"
  | "Underweight (Moderate thinness)"
  | "Underweight (Mild thinness)"
  | "Normal range"
  | "Overweight (Pre-obese)"
  | "Obese (Class I)"
  | "Obese (Class II)"
  | "Obese (Class III)";

const calculateBMI = (heightInCm: number, weightInKg: number): BMICategory => {
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

console.log(calculateBMI(180, 74));
