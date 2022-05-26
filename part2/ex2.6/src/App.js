import { useState, useEffect } from 'react'
import entryService from './services/phonebookEntries'

const Entries = ({persons, personsSet}) => {
  return (
    persons.map(person => <Entry key={person.name} person={person} persons={persons} personsSet={personsSet} />)
  )
}

const Entry = ({person, persons, personsSet}) => {
  const removeEntry = (entry) => {
    entryService
      .deleteEntry(entry)
      .then(response => {
        personsSet(persons.filter(p => p.id !== person.id))
      })
  }

  return (
    <p>{person.name} {person.number}
    <button onClick={() => removeEntry(person)}> delete </button>
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
    if (persons.some(item => item.name === name)) {
      alert(`${name} is already in the phonebook`)
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

  useEffect(() => {
    entryService
      .getAll()
      .then(allPersons => {
        setPersons(allPersons)
      })
  }, [])

  const personsToShow = persons.filter(
    person => person.name.toLowerCase().includes(filterString.toLowerCase()))

  return (
    <div>
      <button onClick={() => {
        entryService.deleteEntry({id: 6})
        .then( r => console.log(r))
      }
      }>
        delete entry
      </button>
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
      <Entries persons={personsToShow} personsSet={setPersons}/>
    </div>
  )
}

export default App