import React, { useState, useEffect } from 'react'
import Person from './components/Person'
import Filter from './components/Filter'
import Notification from './components/Notification'
import PersonForm from './components/PersonForm'
import personService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [ newName, setNewName ] = useState('')
  const [ newNumber, setNewNumber ] = useState('')
  const [ filter, setFilter ] = useState('')
  const [ notification, setNotification ] = useState(null)

  useEffect(() => {
    personService.getAll().then(data => {
      setPersons(data)
    })
  }, [])

  const notifyWith = (content, type = 'success') => {
    setNotification({ content, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  } 

  const addNewPerson = (event) => {
    event.preventDefault()

    const existingPerson = persons.find(p => p.name === newName)  
    if ( existingPerson ){
      const sure = window.confirm(`${newName} is already in the phonebook, replace the old number?`)
      if (!sure) {
        return 
      }

      existingPerson.number = newNumber
      personService
        .update(existingPerson.id, existingPerson)
        .then(updatedPerson => {
          setPersons(persons.map(p => p.id === existingPerson.id ? updatedPerson : p))
          setNewName('')
          setNewNumber('')
          notifyWith(`Updated number of ${existingPerson.name}`)
        }).catch(error => {
          notifyWith(`${existingPerson.name} had already been removed`, 'error')
          setPersons(persons.filter(p => p.id !== existingPerson.id))
        })
      return 
    } 

    const newPerson = {
      name: newName,
      number: newNumber
    }

    personService
      .create(newPerson)
      .then(createdPerson => {
        setPersons(persons.concat(createdPerson))
        setNewName('')
        setNewNumber('')
        notifyWith(`Added ${createdPerson.name}`)
      }).catch(error => {
        const cause = error.response.data.error
          .replace('name: Path', '')
          .replace('number: Path', '') 
          .replaceAll('(', '').replaceAll(')', '')
          .replace('Person validation failed:', '')
          .replace('`', '').replace('`', '').replace('.', '')
        notifyWith(`${cause}`, 'error')
      })
  }

  const removePerson = (id) => {
    const personToDelete = persons.find(p => p.id === id)
    const sure = window.confirm(`Delete ${personToDelete.name}?`)
    if (!sure) {
      return 
    }

    personService.remove(id).then(() => {
      setPersons(persons.filter(p => p.id !== id))
      notifyWith(`Removed ${personToDelete.name}`)
    })
  }

  const personsToShow = filter.length===0 ? persons :
    persons.filter(p => p.name.toLowerCase().includes(filter.toLowerCase()) )
    
  return (
    <div>
      <h2>Phonebook</h2>

      <Notification notification={notification} />

      <Filter 
        filter={filter}
        setFilter={setFilter}
      />

      <PersonForm
        addNewPerson={addNewPerson}
        newName={newName}
        setNewName={setNewName}
        newNumber={newNumber}
        setNewNumber={setNewNumber}
      />

      <h2>Numbers</h2>
      {personsToShow.map(p => 
        <Person
          key={p.id}
          person={p}
          removePerson={removePerson}
        />
      )}
    </div>
  )

}

export default App