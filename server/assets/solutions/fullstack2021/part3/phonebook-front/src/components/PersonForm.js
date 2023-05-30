import React from 'react'

const PersonForm = ({ addNewPerson, setNewName, setNewNumber, newName, newNumber }) => {
  return (
    <div>
      <h2>add a new</h2>
      <form onSubmit={addNewPerson}>
        <div>
          name: 
          <input
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
          />
        </div>
        <div>number: 
          <input 
            value={newNumber}
            onChange={(event) => setNewNumber(event.target.value)}
          />
        </div>
        <div><button type="submit">add</button></div>
      </form>
    </div>
  )
}

export default PersonForm