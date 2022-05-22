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
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilterString] = useState('')

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

  const personsToShow = persons.filter(
    person => person.name.toLowerCase().includes(filterString.toLowerCase()))

  return (
    <div>
      <h2>Phonebook</h2>
      <div>
        filter shown with 
        <input
        value={filterString}
        onChange={handleInputChange(setFilterString)}
        />
      </div>
      <h2>add a new</h2>
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
      <Entries persons={personsToShow}/>
    </div>
  )
}

export default App