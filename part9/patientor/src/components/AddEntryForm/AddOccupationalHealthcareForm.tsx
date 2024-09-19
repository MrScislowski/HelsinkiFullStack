import { TextField } from "@mui/material";
import { EntrySansId, OccupationalHealthcareEntry } from "../../types";

interface Props {
  formState: Omit<OccupationalHealthcareEntry, "id">;
  setFormState: React.Dispatch<React.SetStateAction<EntrySansId>>;
}

const AddOccupationalHealthcareForm = ({ formState, setFormState }: Props) => {
  return (
    <>
      <TextField
        label="Employer Name"
        fullWidth
        value={formState.employerName}
        onChange={({ target }) =>
          setFormState({
            ...formState,
            employerName: target.value,
          })
        }
      />
      <TextField
        label="Sick Leave Start"
        fullWidth
        value={formState.sickLeave?.startDate}
        type="date"
        onChange={({ target }) =>
          setFormState({
            ...formState,
            sickLeave: {
              startDate: target.value,
              endDate: formState.sickLeave?.endDate || "",
            },
          })
        }
      />

      <TextField
        label="Sick Leave End"
        fullWidth
        value={formState.sickLeave?.endDate}
        type="date"
        onChange={({ target }) =>
          setFormState({
            ...formState,
            sickLeave: {
              startDate: target.value,
              endDate: formState.sickLeave?.endDate || "",
            },
          })
        }
      />
    </>
  );
};

export default AddOccupationalHealthcareForm;
