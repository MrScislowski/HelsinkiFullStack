import { useState } from "react";
import patientService from "../../services/patients";
import { Diagnosis, Entry, EntryType, UnionOmit } from "../../types";
import { assertNever } from "../../utils";

import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { Patient } from "../../types";
import { AxiosError } from "axios";
import {
  InputLabel,
  MenuItem,
  // OutlinedInput,
  Select,
  SelectChangeEvent,
} from "@mui/material";

interface InputField {
  properties: {
    type: "text" | "date";
    id: string;
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    [others: string]: unknown;
  };
  clear: () => void;
}

const useInputField = (
  id: string,
  label: string,
  type: InputField["properties"]["type"]
): InputField => {
  let defaultValue: string;

  switch (type) {
    case "text":
      defaultValue = "";
      break;
    case "date":
      defaultValue = new Date().toISOString().substring(0, 10);
      break;
    default:
      return assertNever(type);
  }
  const [value, setValue] = useState<string>(defaultValue);

  const onChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setValue(e.target.value);
  };

  const clear = () => {
    setValue(defaultValue);
  };

  const formattingProperties = {
    // margin: "dense",
    fullWidth: true,
  };

  return {
    properties: {
      id,
      label,
      type,
      value,
      onChange,
      ...formattingProperties,
    },
    clear,
  };
};

interface AddEntryFormProps {
  patientId: string;
  patients: Patient[];
  setPatients: React.Dispatch<React.SetStateAction<Patient[]>>;
  allDiagnoses: Diagnosis[];
}

const AddEntryForm = (props: AddEntryFormProps) => {
  const [open, setOpen] = useState(false);
  const [notification, setNotification] = useState("");

  const [entryType, setEntryType] = useState<EntryType>(EntryType.HealthCheck);
  const [selectedDiagnosisCodes, setSelectedDiagnosisCodes] = useState<
    string[]
  >([]);

  const dateField = useInputField("entrydate", "Date of Service", "date");
  const descriptionField = useInputField("description", "Description", "text");
  const specialistField = useInputField(
    "specialist",
    "Specialist Name",
    "text"
  );
  const healthCheckRatingField = useInputField(
    "healthCheckRating",
    "Health Check Rating",
    "text"
  );
  const dischargeCriteriaField = useInputField(
    "dischargeCriteria",
    "Discharge Criteria",
    "text"
  );
  const dischargeDateField = useInputField(
    "dischargeDate",
    "Discharge Date",
    "date"
  );
  const employerField = useInputField("employer", "Employer Name", "text");
  const sickLeaveStartField = useInputField(
    "sickLeaveStart",
    "Sick Leave Start Date",
    "date"
  );
  const sickLeaveEndField = useInputField(
    "sickLeaveEnd",
    "Sick Leave End Date",
    "date"
  );

  const baseFormFields = [dateField, descriptionField, specialistField];

  let formFields: Array<InputField> = [];

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
      return assertNever(entryType);
  }

  const fieldsToObject = (): UnionOmit<Entry, "id"> => {
    const baseEntry = {
      type: entryType,
      date: dateField.properties.value,
      description: descriptionField.properties.value,
      specialist: specialistField.properties.value,
    };

    switch (baseEntry.type) {
      case EntryType.Hospital:
        return {
          ...baseEntry,
          discharge: {
            criteria: dischargeCriteriaField.properties.value,
            date: dischargeDateField.properties.value,
          },
        };
      case EntryType.OccupationalHealthcare:
        return {
          ...baseEntry,
          employerName: employerField.properties.value,
          sickLeave: {
            startDate: sickLeaveStartField.properties.value,
            endDate: sickLeaveEndField.properties.value,
          },
        };
      case EntryType.HealthCheck:
        return {
          ...baseEntry,
          healthCheckRating: parseInt(healthCheckRatingField.properties.value),
        };

      default:
        return assertNever(baseEntry.type);
    }
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
        formFields.forEach((field) => field.clear());
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
            <TextField key={field.properties.id} {...field.properties} />
          ))}

          <InputLabel id="diagnoses-select-label">Diagnoses</InputLabel>
          <Select
            labelId="diagnoses-select-label"
            id="diagnoses-select"
            multiple
            value={selectedDiagnosisCodes}
            label="Diagnoses"
            // input={<OutlinedInput label="Diagnosis Codes" />}
            onChange={(e: SelectChangeEvent<typeof selectedDiagnosisCodes>) => {
              setSelectedDiagnosisCodes(
                typeof e.target.value === "string"
                  ? e.target.value.split(",")
                  : e.target.value
              );
            }}
          >
            {props.allDiagnoses.map((d) => (
              <MenuItem key={d.code} value={d.code}>
                {d.code}
              </MenuItem>
            ))}
          </Select>
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
