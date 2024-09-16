export interface DiaryEntryData {
  id: string;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

export type DiaryEntryDataUnsaved = Omit<DiaryEntryData, "id">;
