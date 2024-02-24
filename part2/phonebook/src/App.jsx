import { useState } from "react";
import FilterForm from "./FilterForm";
import AddEntryForm from "./AddEntryForm";
import NumbersDisplay from "./NumbersDisplay";
import { useEffect } from "react";
import personService from "./personService";

const SuccessNotification = (props) => {
  const { message } = props;

  const notifierStyle = {
    width: "100%",
    padding: 10,
    backgroundColor: "#4CAF50",
    color: "white",
    fontSize: 16,
  };

  if (!message) {
    return null;
  }

  return <div style={notifierStyle}>{message}</div>;
};

const ErrorNotification = (props) => {
  const { message } = props;

  const notifierStyle = {
    width: "100%",
    padding: 10,
    backgroundColor: "#F44336",
    color: "white",
    fontSize: 16,
  };

  if (!message) {
    return null;
  }

  return <div style={notifierStyle}>{message}</div>;
};

const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState("");
  const [newNumber, setNewNumber] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [successNotification, setSuccessNotification] = useState(null);
  const [errorNotification, setErrorNotification] = useState(null);

  useEffect(() => {
    personService.getAll().then((data) => setPersons(data));
  }, []);

  return (
    <div>
      <ErrorNotification message={errorNotification} />
      <SuccessNotification message={successNotification} />
      <h2>Phonebook</h2>
      <FilterForm searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <AddEntryForm
        persons={persons}
        setPersons={setPersons}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
        successNotification={successNotification}
        setSuccessNotification={setSuccessNotification}
        errorNotification={errorNotification}
        setErrorNotification={setErrorNotification}
      />
      <NumbersDisplay
        persons={persons}
        setPersons={setPersons}
        searchTerm={searchTerm}
      />
    </div>
  );
};

export default App;
