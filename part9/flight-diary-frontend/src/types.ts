export interface DiaryEntryData {
  id: string;
  date: string;
  weather: string;
  visibility: string;
  comment: string;
}

export type DiaryEntryDataUnsaved = Omit<DiaryEntryData, "id">;

export enum Weather {
  Sunny = "sunny",
  Rainy = "rainy",
  Cloudy = "cloudy",
  Stormy = "stormy",
  Windy = "windy",
}

export enum Visibility {
  Great = "great",
  Good = "good",
  Ok = "ok",
  Poor = "poor",
}
