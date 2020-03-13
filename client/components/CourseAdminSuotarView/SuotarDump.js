import React from 'react'
import copy from 'copy-to-clipboard'

const SuotarDump = ({ students }) => {

  // student number;grade;credits;language;date
  const suotarFriendlyCompleted = (completed) => {
    const date = new Date(completed)
    return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
  }
  const suotarString = students
    .map(stud => `${stud.studentNumber};${stud.grade};${stud.credits},0;;${suotarFriendlyCompleted(stud.completed)}`)
    .join('\n')

  return (
    <div style={{ float: 'right' }}>
      {suotarString.split('\n').map(val => <span key={val}>{val} <br /> </span>)}
      {suotarString && <button onClick={() => copy(suotarString)}>Copy to Clipboard</button>}
    </div>
  )
}

export default SuotarDump
