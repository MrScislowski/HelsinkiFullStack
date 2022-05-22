import { useState } from 'react'

const Entries = ({persons}) => {
  return (
    persons.map(person => <Entry key={person.name} person={person} />)
  )
}

const Entry = ({person}) => {
  return (
    <p>{person.name} {person.number}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-1234567' }
  ]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')

  const handleInputChange = (changeFn) => {
    const changeHandler = (event) => {
      changeFn(event.target.value)
    }
    return changeHandler
  }

  const addNewEntry = (event) => {
    event.preventDefault();
    if (persons.some(item => item.name === newName)) {
      alert(`${newName} is already in the phonebook`)
    } else {
      setPersons(persons.concat({ name: newName, number: newNumber}))
    }
    setNewName('')
    setNewNumber('')
    
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addNewEntry}>
        <div>
          name: 
            <input 
            value={newName}
            onChange={handleInputChange(setNewName)} 
            />
        </div>
        <div>
          number:
            <input
            value={newNumber}
            onChange={handleInputChange(setNewNumber)}
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