import { TextField } from "@mui/material";
import { EntrySansId, HospitalEntry } from "../../types";

interface Props {
  formState: Omit<HospitalEntry, "id">;
  setFormState: React.Dispatch<React.SetStateAction<EntrySansId>>;
}

const AddHospitalForm = ({ formState, setFormState }: Props) => {
  return (
    <>
      <TextField
        label="Discharge date"
        fullWidth
        value={formState.discharge.date}
        type="date"
        onChange={({ target }) =>
          setFormState({
            ...formState,
            discharge: { ...formState.discharge, date: target.value },
          })
        }
      />
      <TextField
        label="Discharge Criteria"
        fullWidth
        value={formState.discharge.criteria}
        onChange={({ target }) =>
          setFormState({
            ...formState,
            discharge: { ...formState.discharge, criteria: target.value },
          })
        }
      />
    </>
  );
};

export default AddHospitalForm;
