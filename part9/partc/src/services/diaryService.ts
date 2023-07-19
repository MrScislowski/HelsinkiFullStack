import entries from "../../data/diaries";

import { DiaryEntry, NonSensitiveDiaryEntry, NewDiaryEntry } from "../types";

const getEntries = (): DiaryEntry[] => {
  return entries;
};

const getNonSensitiveEntries = (): NonSensitiveDiaryEntry[] => {
  return entries.map((entry) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { comment, ...rest } = entry;
    return rest;
  });
};

const findById = (id: number): DiaryEntry | undefined => {
  const chosenEntry = entries.find((entry) => entry.id === id);
  return chosenEntry;
};

const addEntry = (newEntry: DiaryEntry) => {
  entries.push(newEntry);
};

const addDiary = (newEntry: NewDiaryEntry): DiaryEntry => {
  const fullEntry: DiaryEntry = {
    id: Math.max(...entries.map((entry) => entry.id)) + 1,
    ...newEntry,
  };
  entries.push(fullEntry);
  return fullEntry;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addEntry,
  addDiary,
  findById,
};
