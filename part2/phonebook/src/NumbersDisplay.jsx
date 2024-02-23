const NumbersDisplay = (props) => {
  const { persons, searchTerm } = props;
  return (
    <>
      <h2>Numbers</h2>
      {persons
        .filter((person) => person.name.includes(searchTerm))
        .map((person) => (
          <p key={person.id}>
            {person.name} {person.number}
          </p>
        ))}
    </>
  );
};

export default NumbersDisplay;
