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

const AddNewEntryForm = ({formDetails, addNewEntryFunction}) => {
  const {name: [name, nameSet], number: [number, numberSet]} = formDetails

  return (
  <form onSubmit={addNewEntryFunction({name: name, number: number})}>
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

  const addNewEntryFunction = (newEntryDetails) => {
    const foundEntry = persons.find(item => item.name === newName)
    return (event) => {
      event.preventDefault();
      if (
        foundEntry &&
        window.confirm(`${newName} is already added to phonebook, replace the old number with a new one?`)
        ) {
        entryService
          .updateEntry(foundEntry, {name: newName, number: newNumber})
          .then(returnedEntry => {
            setPersons(persons.map(p => p.id !== returnedEntry.id ? p : returnedEntry))
          })
        setNotification(`${newName}'s number replaced`)
        setTimeout(() => setNotification(null), 5000)
      } else {
        entryService
          .create({name: newName, number: newNumber})
          .then(returnedEntry => {
            setPersons(persons.concat(returnedEntry))
          })
        setNotification(`${newName} added to phonebook`)
        setTimeout(() => setNotification(null), 5000)
      }
      setNewName('')
      setNewNumber('')
    }
  }

  const removeEntry = (entry) => {
    if (window.confirm(`Delete ${entry.name}?`)) {
    entryService
      .deleteEntry(entry)
      .then(response => {
        setPersons(persons.filter(p => p.id !== entry.id))
        setNotification(`${entry.name} removed from phonebook`)
        setTimeout(() => setNotification(null), 5000)
      })
    }
  }

  const personsToShow = persons.filter(
    person => person.name.toLowerCase().includes(filterString.toLowerCase()))

  return (
    <div>
      <Notification message={notification} />
      <h2>Phonebook</h2>
      <div>
        filter shown with 
        <input
        value={filterString}
        onChange={handleInputChange(setFilterString)}
        />
      </div>
      <h3>add a new</h3>

      <AddNewEntryForm 
        formDetails={{name: [newName, setNewName], number:[newNumber, setNewNumber]}} 
        addNewEntryFunction={addNewEntryFunction} />
      <h3>Numbers</h3>
      <Entries persons={personsToShow} removeFn={removeEntry}/>
    </div>
  )
}

export default App