import { ZodError } from "zod";

export const zodErrorToText = (err: ZodError): string => {
  let message = "";

  err.issues.forEach((issue) => {
    message += `${issue.path}: ${issue.message} \n`;
  });

  return message;
};
