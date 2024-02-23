import personService from "./personService";

const AddEntryForm = (props) => {
  const { persons, setPersons, newName, setNewName, newNumber, setNewNumber } =
    props;
  return (
    <>
      <h2>Add New</h2>
      <form
        onSubmit={(e) => {
          e.preventDefault();

          if (persons.find((person) => person.name === newName)) {
            alert(`${newName} is already in the phonebook`);
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
              })
              .catch((err) => {
                console.log(`error adding person`, err);
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
