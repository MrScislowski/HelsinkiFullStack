import { TextField } from "@mui/material";
import { EntrySansId, HealthCheckEntry } from "../../types";

interface Props {
  formState: Omit<HealthCheckEntry, "id">;
  setFormState: React.Dispatch<React.SetStateAction<EntrySansId>>;
}

const AddHealthCheckForm = ({ formState, setFormState }: Props) => {
  return (
    <>
      <TextField
        label="Healthcheck rating"
        fullWidth
        value={formState.healthCheckRating}
        onChange={({ target }) =>
          setFormState({
            ...formState,
            healthCheckRating: Number(target.value),
          })
        }
      />
    </>
  );
};

export default AddHealthCheckForm;
