import { useState } from "react";
import patientService from "../../services/patients";
import { Entry, EntryType, UnionOmit } from "../../types";
import { assertNever } from "../../utils";

import Button from "@mui/material/Button";
import TextField, { StandardTextFieldProps } from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Patient } from "../../types";
import { AxiosError } from "axios";
import { MenuItem, Select } from "@mui/material";

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

  const [entryType, setEntryType] = useState<EntryType>(EntryType.HealthCheck);

  const dateField = useTextField("date", "text");
  const descriptionField = useTextField("description", "text");
  const specialistField = useTextField("specialist", "text");
  const diagnosesField = useTextField("diagnosisCodes", "text");

  const healthCheckRatingField = useTextField("healthCheckRating", "text");

  const dischargeCriteriaField = useTextField("dischargeCriteria", "text");
  const dischargeDateField = useTextField("dischargeDate", "text");

  const employerField = useTextField("employer", "text");
  const sickLeaveStartField = useTextField("sickLeaveStart", "text");
  const sickLeaveEndField = useTextField("sickLeaveEnd", "text");

  const baseFormFields = [
    dateField,
    descriptionField,
    specialistField,
    diagnosesField,
  ];

  let formFields: Array<{
    id: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    label: string;
  }> = [];

  switch (entryType) {
    case EntryType.Hospital:
      formFields = [
        ...baseFormFields,
        dischargeCriteriaField,
        dischargeDateField,
      ];
      break;
    case EntryType.OccupationalHealthcare:
      formFields = [
        ...baseFormFields,
        employerField,
        sickLeaveStartField,
        sickLeaveEndField,
      ];
      break;
    case EntryType.HealthCheck:
      formFields = [...baseFormFields, healthCheckRatingField];
      break;
    default:
      console.log("in main part...");
      console.log(
        `Here are the possible values: ${EntryType.Hospital}, ${EntryType.HealthCheck}, ${EntryType.OccupationalHealthcare}`
      );
      console.log(`Here is what I got: ${entryType}`);
      console.log(
        `Tests for equality... ${EntryType.Hospital === entryType}, ${
          EntryType.HealthCheck === entryType
        }, ${EntryType.OccupationalHealthcare === entryType}`
      );
      console.log(
        `Types: ${typeof EntryType.OccupationalHealthcare}, ${typeof entryType}`
      );
      return assertNever(entryType);
  }

  const fieldsToObject = (): UnionOmit<Entry, "id"> => {
    const baseEntry = {
      type: entryType,
      date: dateField.value,
      description: descriptionField.value,
      specialist: specialistField.value,
      diagnosisCodes: diagnosesField.value.split(",").map((el) => el.trim()),
    };

    switch (baseEntry.type) {
      case EntryType.Hospital:
        return {
          ...baseEntry,
          discharge: {
            criteria: dischargeCriteriaField.value,
            date: dischargeDateField.value,
          },
        };
      case EntryType.OccupationalHealthcare:
        return {
          ...baseEntry,
          employerName: employerField.value,
          sickLeave: {
            startDate: sickLeaveStartField.value,
            endDate: sickLeaveEndField.value,
          },
        };
      case EntryType.HealthCheck:
        return {
          ...baseEntry,
          healthCheckRating: parseInt(healthCheckRatingField.value),
        };

      default:
        console.log(
          `Here are the possible values: ${EntryType.Hospital}, ${EntryType.HealthCheck}, ${EntryType.OccupationalHealthcare}`
        );
        console.log(`Here is what I got: ${baseEntry.type}`);
        return assertNever(baseEntry.type);
    }
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
          <Select
            labelId="entry-type-select-label"
            id="entry-type-select"
            value={entryType}
            label="Entry Type"
            onChange={(e) => {
              setEntryType(e.target.value as EntryType);
            }}
          >
            {Object.keys(EntryType)
              .filter((key) => isNaN(Number(key)))
              .map((opt) => (
                <MenuItem value={opt} key={opt}>
                  {opt}
                </MenuItem>
              ))}
          </Select>

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
