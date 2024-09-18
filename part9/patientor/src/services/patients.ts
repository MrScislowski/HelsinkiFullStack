import axios, { AxiosError } from "axios";
import { Entry, EntrySansId, Patient, PatientFormValues } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data } = await axios.get<Patient[]>(`${apiBaseUrl}/patients`);

  return data;
};

const create = async (object: PatientFormValues) => {
  const { data } = await axios.post<Patient>(`${apiBaseUrl}/patients`, object);

  return data;
};

const getById = async (id: string) => {
  const { data } = await axios.get<Patient>(`${apiBaseUrl}/patients/${id}`);

  return data;
};

const addEntry = async (
  patientId: string,
  entryData: EntrySansId
): Promise<Entry> => {
  try {
    const { data } = await axios.post<Entry>(
      `${apiBaseUrl}/patients/${patientId}/entries`,
      entryData
    );
    return data;
  } catch (err: unknown) {
    let message: string;
    if (
      err instanceof AxiosError &&
      err.response?.data?.error[0]?.path[0] &&
      err.response?.data?.error[0]?.message
    ) {
      message = `Invalid ${err.response?.data?.error[0]?.path[0]}: ${err.response?.data.error[0].message}`;
    } else {
      message = "unknown error. Check console for details";
      console.log(err);
    }
    throw new Error(message);
  }
};

export default {
  getAll,
  create,
  getById,
  addEntry,
};
