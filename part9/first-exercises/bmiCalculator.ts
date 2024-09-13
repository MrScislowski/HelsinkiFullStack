
const calculateBmi = (height: number, weight: number): string => {
  const heightInM = height / 100
  const bmi = weight / Math.pow(heightInM, 2)

  let description
  if (bmi < 18.5) description = "underweight"
  else if (bmi < 25) description = "normal range"
  else if (bmi < 30) description = "overweight"
  else description = "obese"

  return description
}

console.log(calculateBmi(180, 74))