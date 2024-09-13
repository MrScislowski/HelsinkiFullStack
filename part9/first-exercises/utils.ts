export const parseNumber = (text: string): number => {
  if (isNaN(Number(text))) {
    throw new Error(`${text} cannot be parsed to be a number`);
  }
  return Number(text);
};
