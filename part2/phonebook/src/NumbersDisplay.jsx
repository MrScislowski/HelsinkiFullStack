import personService from "./personService";

const NumbersDisplay = (props) => {
  const { persons, searchTerm, setPersons } = props;

  const handleDelete = (id) => {
    return () => {
      const confirmed = window.confirm(
        `Delete ${persons.find((p) => p.id === id).name}?`
      );
      if (!confirmed) {
        return;
      }
      personService.deletePerson(id);
      setPersons(persons.filter((person) => person.id !== id));
    };
  };

  return (
    <>
      <h2>Numbers</h2>
      {persons
        .filter((person) => person.name.includes(searchTerm))
        .map((person) => (
          <p key={person.id}>
            {person.name} {person.number}{" "}
            <button onClick={handleDelete(person.id)}>delete</button>
          </p>
        ))}
    </>
  );
};

export default NumbersDisplay;
