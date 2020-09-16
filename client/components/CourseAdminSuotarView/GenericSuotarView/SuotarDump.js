import React from 'react'
import copy from 'copy-to-clipboard'

const suotarFriendlyCompleted = (completed) => {
  const date = new Date(completed)
  return `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`
}

const SuotarDump = ({ students }) => {
  const suotarString = students
    .map(
      (stud) =>
        `${stud.studentNumber};;${stud.credits},0;;${suotarFriendlyCompleted(
          stud.completed,
        )}`,
    )
    .join('\n')

  if (!suotarString) return null

  return (
    <div style={{ float: 'right' }}>
      <h3>for suotar</h3>
      <div>
        {suotarString.split('\n').map((val) => (
          <span key={val}>
            {val}
            <br />
          </span>
        ))}
        <button type="button" onClick={() => copy(suotarString)}>
          Copy to Clipboard
        </button>
      </div>
    </div>
  )
}

export default SuotarDump
