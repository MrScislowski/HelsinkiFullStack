import { useState, useEffect } from 'react'
import entryService from './services/phonebookEntries'
import Notification from './components/Notification'

const Entries = ({persons, removeFn}) => {
  return (
    persons.map(person => { 
    return <Entry key={person.id} person={person} remove={() => removeFn(person)} />
    }
    )
  )
}

const Entry = ({person, remove}) => {
  return (
    <p>{person.name} {person.number}
    <button onClick={remove}> delete </button>
    </p>
  )
}

const handleInputChange = (changeFn) => {
  const changeHandler = (event) => {
    changeFn(event.target.value)
  }
  return changeHandler
}

const AddNewEntryForm = ({persons, personsSet, newEntry}) => {
  const {name: [name, nameSet], number: [number, numberSet]} = newEntry
  const addNewEntry = (event) => {
    event.preventDefault();
    const foundEntry = persons.find(item => item.name === name)
    if (
      foundEntry &&
      window.confirm(`${name} is already added to phonebook, replace the old number with a new one?`)
      ) {
      entryService
        .updateEntry(foundEntry, {name: name, number: number})
        .then(returnedEntry => {
          personsSet(persons.map(p => p.id !== returnedEntry.id ? p : returnedEntry))
        })
    } else {
      entryService
        .create({name: name, number: number})
        .then(returnedEntry => {
          personsSet(persons.concat(returnedEntry))
        })
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
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    entryService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  const removeEntry = (entry) => {
    if (window.confirm(`Delete ${entry.name}?`)) {
    entryService
      .deleteEntry(entry)
      .then(response => {
        setPersons(persons.filter(p => p.id !== entry.id))
      })
    }
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
      <h3>add a new</h3>

      <AddNewEntryForm persons={persons} personsSet={setPersons} newEntry={{name: [newName, setNewName], number:[newNumber, setNewNumber]}} />
      <h3>Numbers</h3>
      <Entries persons={personsToShow} removeFn={removeEntry}/>
    </div>
  )
}

export default App