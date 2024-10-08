import personService from "./personService";

const AddEntryForm = (props) => {
  const {
    persons,
    setPersons,
    newName,
    setNewName,
    newNumber,
    setNewNumber,
    successNotification,
    setSuccessNotification,
    errorNotification,
    setErrorNotification,
  } = props;

  return (
    <>
      <h2>Add New</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          const foundPerson = persons.find((person) => person.name === newName);

          if (foundPerson) {
            const shouldReplace = window.confirm(
              `${newName} is already in the phonebook. Replace their number?`
            );

            if (!shouldReplace) {
              return;
            }
            const updatedPerson = {
              ...foundPerson,
              number: newNumber,
            };
            personService
              .updatePerson(updatedPerson)
              .then((response) => {
                setPersons(
                  persons.map((p) => (p.id !== foundPerson.id ? p : response))
                );
                setNewName("");
                setNewNumber("");

                setSuccessNotification(
                  `${updatedPerson.name}'s number updated`
                );
                setTimeout(() => setSuccessNotification(null), 3000);
              })
              .catch((err) => {
                //
                setNewName("");
                setNewNumber("");

                setErrorNotification(err.response.data.error);
                setTimeout(() => setErrorNotification(null), 3000);
              });
          } else {
            const newPerson = {
              name: newName,
              number: newNumber,
            };
            personService
              .addPerson(newPerson)
              .then((response) => {
                setPersons(persons.concat(response));
                setNewName("");
                setNewNumber("");

                setSuccessNotification(`${newPerson.name} added`);
                setTimeout(() => setSuccessNotification(null), 3000);
              })
              .catch((err) => {
                setErrorNotification(err.response.data.error);
                setTimeout(() => setErrorNotification(null), 3000);
              });
          }
        }}
      >
        <div>
          name:
          <input value={newName} onChange={(e) => setNewName(e.target.value)} />
        </div>
        <div>
          number:
          <input
            value={newNumber}
            onChange={(e) => setNewNumber(e.target.value)}
          />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
    </>
  );
};

export default AddEntryForm;
