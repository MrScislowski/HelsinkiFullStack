import axios from "axios";
import { DiaryEntryData, DiaryEntryDataUnsaved } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

const getAll = (): Promise<DiaryEntryData[]> => {
  return axios.get<DiaryEntryData[]>(baseUrl).then((res) => res.data);
};

const add = (entry: DiaryEntryDataUnsaved): Promise<DiaryEntryData> => {
  return axios.post<DiaryEntryData>(baseUrl, entry).then((res) => res.data);
};

export default { getAll, add };
