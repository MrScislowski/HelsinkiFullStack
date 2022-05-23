import { useState, useEffect } from 'react'
import axios from 'axios'

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

const handleInputChange = (changeFn) => {
  const changeHandler = (event) => {
    changeFn(event.target.value)
  }
  return changeHandler
}

const AddNewEntryForm = ({persons, personsSet, name, nameSet, number, numberSet}) => {
  

  const addNewEntry = (event) => {
    event.preventDefault();
    if (persons.some(item => item.name === name)) {
      alert(`${name} is already in the phonebook`)
    } else {
      personsSet(persons.concat({ name: name, number: number}))
    }
    nameSet('')
    numberSet('')
  }

  return (
  <form onSubmit={addNewEntry}>
    <div>
      name:
      <input
        value={name}
        onChange={handleInputChange(nameSet)}
      />
    </div>
    <div>
      number:
      <input
        value={number}
        onChange={handleInputChange(numberSet)}
      />
    </div>
    <div>
      <button type="submit">add</button>
    </div>
  </form>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])

  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [filterString, setFilterString] = useState('')

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then(response => {
        // console.log('got', response.data)
        setPersons(response.data)
      })
  }, [])

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
      <h3>add a new</h3>
      <AddNewEntryForm persons={persons} personsSet={setPersons} name={newName} nameSet={setNewName} number={newNumber} numberSet={setNewNumber}/>
      <h3>Numbers</h3>
      <Entries persons={personsToShow}/>
    </div>
  )
}

export default App