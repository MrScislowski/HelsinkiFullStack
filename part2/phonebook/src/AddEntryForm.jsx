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
            setPersons(
              persons.concat({
                name: newName,
                number: newNumber,
                id: persons.length + 1,
              })
            );
            setNewName("");
            setNewNumber("");
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
