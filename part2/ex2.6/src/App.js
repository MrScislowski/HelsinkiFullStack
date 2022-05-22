import { useState } from 'react'

const Entries = ({persons}) => {
  return (
    persons.map(person => <Entry key={person.name} person={person} />)
  )
}

const Entry = ({person}) => {
  return (
    <p>{person.name}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas' }
  ]) 
  const [newName, setNewName] = useState('')

  const handleInputChange = (event) => {
    setNewName(event.target.value)
  }

  const addNewName = (event) => {
    event.preventDefault();
    if (persons.some(item => item.name === newName)) {
      alert(`${newName} is already in the phonebook`)
    } else {
      setPersons(persons.concat({ name: newName}))
    }
    setNewName('')
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addNewName}>
        <div>
          name: 
            <input 
            value={newName}
            onChange={handleInputChange} 
            />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <Entries persons={persons}/>
    </div>
  )
}

export default App