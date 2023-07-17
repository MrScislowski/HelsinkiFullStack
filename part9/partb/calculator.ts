type Operation = "multiply" | "add" | "divide";

const calculator = (a: number, b: number, op: Operation): number => {
  switch (op) {
    case "add":
      return a + b;
    case "divide":
      if (b == 0) throw new Error("can't divide by zero");
    case "multiply":
      return a * b;
    default:
      throw new Error(`unknown operation ${op}`);
  }
};

try {
  calculator(2, 4, "multiply");
} catch (error: unknown) {
  let message = "Something went wrong";
  if (error instanceof Error) {
    message += error.message;
  }
  console.log(message);
}
