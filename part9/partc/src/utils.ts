import { NewDiaryEntry, Weather, Visibility } from "./types";

const parseComment = (comment: unknown): string => {
  if (!comment || !isString(comment)) {
    throw new Error("Incorrect or missing comment");
  }

  return comment;
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};

const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("missing or incorrect date");
  }

  return date;
};

const isDate = (date: string): boolean => {
  return Boolean(Date.parse(date));
};

const isWeather = (str: string): str is Weather => {
  return Object.values(Weather)
    .map((v) => v.toString())
    .includes(str);
};

const parseWeather = (weather: unknown): Weather => {
  if (!isString(weather) || !isWeather(weather)) {
    throw new Error("missing or incorrect weather");
  }

  return weather;
};

const isVisibility = (str: string): str is Visibility => {
  return Object.values(Visibility)
    .map((v) => v.toString())
    .includes(str);
};

const parseVisibility = (vis: unknown): Visibility => {
  if (!isString(vis) || !isVisibility(vis)) {
    throw new Error("missing or incorrect visibility");
  }
  return vis;
};

export const toNewDiaryEntry = (object: unknown): NewDiaryEntry => {
  if (!object || typeof object != "object") {
    throw new Error("object undefined");
  }

  // const comment = parseComment(object.comment);
  if (
    "comment" in object &&
    "date" in object &&
    "visibility" in object &&
    "weather" in object
  ) {
    return {
      date: parseDate(object.date),
      visibility: parseVisibility(object.visibility),
      weather: parseWeather(object.weather),
      comment: parseComment(object.comment),
    };
  } else {
    throw new Error("Incorrect data: some fields missing");
  }
};
