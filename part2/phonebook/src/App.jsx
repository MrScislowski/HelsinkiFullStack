import { useState } from "react";
import FilterForm from "./FilterForm";
import AddEntryForm from "./AddEntryForm";
import NumbersDisplay from "./NumbersDisplay";
import { useEffect } from "react";
import axios from "axios";

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    axios.get("http://localhost:3001/persons").then((response) => {
      setPersons(response.data);
    });
  }, []);

  return (
    <div>
      <h2>Phonebook</h2>
      <FilterForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AddEntryForm
        persons={persons}
        setPersons={setPersons}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />
      <NumbersDisplay persons={persons} searchTerm={searchTerm} />
    </div>
  );
};

export default App;
