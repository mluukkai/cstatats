import React from 'react'

const Filter = ({ filter, setFilter }) => {
  return (
    <div>
      filter shown with
      <input 
        value={filter}
        onChange={(event) => setFilter(event.target.value)}        
      />
    </div>
   )
}

export default Filter