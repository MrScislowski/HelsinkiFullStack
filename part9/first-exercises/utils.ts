export const parseRequestBody = (input: unknown): Record<string, unknown> => {
  if (!input || typeof input !== "object") {
    throw new Error("request body is not an object");
  }

  if (!Object.keys(input).every((k) => typeof k === "string")) {
    throw new Error("request body object not index-able by strings");
  }

  return input as Record<string, unknown>;
};

export const parseNumber = (text: unknown): number => {
  if (isNaN(Number(text))) {
    throw new Error(`${text} cannot be parsed to be a number`);
  }
  return Number(text);
};

export const parseNumberArray = (input: unknown): number[] => {
  if (!Array.isArray(input)) {
    throw new Error(`${input} is not an array, as expected`);
  }
  return input.map(parseNumber);
};
