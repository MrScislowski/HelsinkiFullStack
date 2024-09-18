import axios from "axios";
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
  const { data } = await axios.post<Entry>(
    `${apiBaseUrl}patients/${patientId}/entries`,
    entryData
  );
  return data;
};

export default {
  getAll,
  create,
  getById,
  addEntry,
};
