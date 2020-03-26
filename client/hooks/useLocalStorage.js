import { useState } from 'react'

const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(localStorage.getItem(key) || initialValue)

  const setLocalStorage = (newValue) => {
    localStorage.setItem(key, newValue)
    setValue(newValue)
  }

  return [value, setLocalStorage]
}

export default useLocalStorage
