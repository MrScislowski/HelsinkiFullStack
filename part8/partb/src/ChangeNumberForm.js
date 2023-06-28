import { useMutation } from "@apollo/client";
import { useEffect, useState } from "react";
import { ALL_PERSONS, EDIT_NUMBER } from "./queries";

const useField = (name) => {
  const [value, setValue] = useState("");

  return {
    value: value,
    onChange: (event) => setValue(event.target.value),
    placeholder: name,
    name: name,
  };
};

const ChangeNumberForm = ({ setErrorMessage }) => {
  const fields = [useField("name"), useField("phone")];

  const [editNumber, result] = useMutation(EDIT_NUMBER, {
    refetchQueries: [{ query: ALL_PERSONS }],
    onError: (error) => {
      const messages = error.graphQLErrors[0].message;
      // setErrorMessage(messages);
      // setTimeout(() => setErrorMessage(null), 5000);
    },
  });

  const handleNumberChange = (event) => {
    event.preventDefault();

    const variablesStructure = fields.reduce((acc, field) => {
      acc[field.name] = field.value;
      return acc;
    }, {});

    editNumber({ variables: variablesStructure });

    fields.forEach((field) => field.onChange({ target: { value: "" } }));
  };

  useEffect(() => {
    if (result.data && result.data.editNumber === null) {
      setErrorMessage("Person not found");
    }
  }, [result.data]);

  return (
    <>
      <h3>Change number</h3>
      <form onSubmit={(event) => handleNumberChange(event)}>
        {fields.map((field) => (
          <input key={field.name} type="text" {...field} />
        ))}
        <button type="submit">Apply number change</button>
      </form>
    </>
  );
};

export default ChangeNumberForm;
