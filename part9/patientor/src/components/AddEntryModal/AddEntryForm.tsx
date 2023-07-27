import { useState } from "react";
import patientService from "../../services/patients";

import Button from "@mui/material/Button";
import TextField, { StandardTextFieldProps } from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { HealthCheckEntry, Patient } from "../../types";
import { AxiosError } from "axios";

const textFieldProperties: StandardTextFieldProps = {
  autoFocus: true,
  margin: "dense",
  fullWidth: true,
};

const useTextField = (
  label: string,
  type: React.InputHTMLAttributes<unknown>["type"]
) => {
  const [value, setValue] = useState("");

  return {
    ...textFieldProperties,
    id: label,
    label,
    type,

    value,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) =>
      setValue(e.target.value),
  };
};

interface AddEntryFormProps {
  patientId: string;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
}

const AddEntryForm = (props: AddEntryFormProps) => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const dateField = useTextField("date", "text");
  const descriptionField = useTextField("description", "text");
  const specialistField = useTextField("specialist", "text");
  const diagnosesField = useTextField("diagnosisCodes", "text");
  const healthCheckRatingField = useTextField("healthCheckRating", "text");

  const formFields = [
    dateField,
    descriptionField,
    specialistField,
    diagnosesField,
    healthCheckRatingField,
  ];

  const fieldsToObject = (): Omit<HealthCheckEntry, "id"> => {
    return {
      type: "HealthCheck",
      date: dateField.value,
      description: descriptionField.value,
      specialist: specialistField.value,
      diagnosisCodes: diagnosesField.value.split(",").map((el) => el.trim()),
      healthCheckRating: parseInt(healthCheckRatingField.value),
    };
  };

  const clearFields = () => {
    formFields.forEach((field) =>
      field.onChange({
        target: { value: "" },
      } as React.ChangeEvent<HTMLInputElement>)
    );
  };

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setNotification("");
  };

  const handleSubmit = () => {
    patientService
      .addEntry(props.patientId, fieldsToObject())
      .then((res) => {
        console.dir(res);
        clearFields();
        setOpen(false);
        setNotification("");
        // put entry into this patient...
        const thePatient = props.patients.find((p) => p.id === props.patientId);
        if (thePatient === undefined) {
          throw new Error(
            `Patient with id ${props.patientId} not found in collection`
          );
        }
        const updatedEntries = [...thePatient.entries, res];
        const updatedPatient: Patient = {
          ...thePatient,
          entries: updatedEntries,
        };
        const newPatients = props.patients.map((p) => {
          return p.id === props.patientId ? updatedPatient : p;
        });
        props.setPatients(newPatients);
      })
      .catch((err: unknown) => {
        let msg = "error occurred. ";
        if (err instanceof AxiosError && err.response) {
          msg += err.response.data;
        } else {
          throw err;
        }
        setNotification(msg);
      });
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Add Medical Entry
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Medical Entry</DialogTitle>
        <DialogContent>
          <DialogContentText color={"red"}>{notification}</DialogContentText>
          {formFields.map((field) => (
            <TextField key={field.label} {...field} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Add Entry</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddEntryForm;
