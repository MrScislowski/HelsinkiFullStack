import { useQuery } from "@apollo/client";
import { ALL_PERSONS } from "./queries";
import Persons from "./Persons";
import PersonForm from "./PersonForm";
import ChangeNumberForm from "./ChangeNumberForm";
import { useState } from "react";

function App() {
  const [errorMessage, setErrorMessage] = useState(null);
  const result = useQuery(ALL_PERSONS);

  if (result.loading) {
    return <div>loading...</div>;
  }

  return (
    <>
    <Notification errorMessage={errorMessage} />
      <Persons persons={result.data.allPersons} />
      <PersonForm setErrorMessage={setErrorMessage} />
      <ChangeNumberForm setErrorMessage={setErrorMessage}/>
    </>
  );
}

const Notification = ({errorMessage}) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div style={{color: "red"}}>{errorMessage}</div>
  )
}

export default App;
