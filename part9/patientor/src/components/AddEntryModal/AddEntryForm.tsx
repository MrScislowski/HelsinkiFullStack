import { useState } from "react";
import Button from "@mui/material/Button";
import TextField, { StandardTextFieldProps } from "@mui/material/TextField";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

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

const AddEntryForm = () => {
  const [open, setOpen] = useState(false);
  const dateField = useTextField("date", "text");
  const descriptionField = useTextField("description", "text");
  const specialistField = useTextField("specialist", "text");
  const formFields = [dateField, descriptionField, specialistField];

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
  };

  const handleSubmit = () => {
    formFields.forEach((f) => console.log(`value of ${f.label} is ${f.value}`));
    clearFields();
    setOpen(false);
  };

  return (
    <div>
      <Button variant="contained" onClick={handleClickOpen}>
        Add Medical Entry
      </Button>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Medical Entry</DialogTitle>
        <DialogContent>
          <DialogContentText>Add Details Below...</DialogContentText>
          {formFields.map((field) => (
            <TextField key={field.label} {...field} />
          ))}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit}>Subscribe</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default AddEntryForm;
