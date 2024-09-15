import allDiagnoses from "../data/diagnoses";
import { Diagnosis } from "../types";

const getAll = (): Diagnosis[] => {
  return allDiagnoses;
};

export default { getAll };
