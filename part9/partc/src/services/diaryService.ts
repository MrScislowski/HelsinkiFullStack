import entries from "../../data/diaries";

import { DiaryEntry, NonSensitiveDiaryEntry } from "../types";

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

const addEntry = () => {
  return null;
};

export default {
  getEntries,
  getNonSensitiveEntries,
  addEntry,
};
