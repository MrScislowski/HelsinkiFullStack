import axios from "axios";
import { DiaryEntryData } from "../types";

const baseUrl = "http://localhost:3000/api/diaries";

const getAll = (): Promise<DiaryEntryData[]> => {
  return axios.get<DiaryEntryData[]>(baseUrl).then((res) => res.data);
};

export default { getAll };
