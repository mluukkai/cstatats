import React, { useMemo } from 'react'
import copy from 'copy-to-clipboard'

const SuotarPayload = ({ payload }) => {
  const lines = useMemo(() => {
    return payload ? payload.split('\n') : []
  }, [payload])

  const handleCopy = () => {
    copy(payload)
  }

  return (
    <div>
      {lines.map((val) => (
        <div key={val}>{val}</div>
      ))}

      <button onClick={handleCopy} type="button">
        Copy to Clipboard
      </button>
    </div>
  )
}

export default SuotarPayload
