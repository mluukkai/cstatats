import { useState, useEffect } from 'react'

import { useSubscription, useApolloClient } from '@apollo/client'
import { BOOK_ADDED } from './queries.js'

import Authors from './components/Authors'
import Books from './components/Books'
import Recommend from './components/Recommend'
import NewBook from './components/NewBook'
import LoginForm from './components/LoginForm'
import Notification from './components/Notification'

import { STORAGE_KEY } from './util'

import { updateCacheWith } from './util'

const App = () => {
  const [page, setPage] = useState('books')
  const [token, setToken] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) {
      setToken(token)
    }
  }, [])

  const client = useApolloClient()

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const addedBook = data.data.bookAdded
      notify(`a book ${addedBook.title} by ${addedBook.author.name} was added`)
      updateCacheWith(addedBook,  client.cache)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.removeItem(STORAGE_KEY)
  }

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const navigateTo = (page) =>
    () => setPage(page) 

  return (
    <div>
      <div>
        <button onClick={navigateTo('authors')}>authors</button>
        <button onClick={navigateTo('books')}>books</button>
        {token&&(
          <>
            <button onClick={navigateTo('recommend')} >recommend</button>
            <button onClick={navigateTo('add')}>add book</button>
            <button onClick={logout}>logout</button>
          </>
        )}
        <button onClick={navigateTo('login')}>login</button>
      </div>

      <Notification errorMessage={errorMessage} />
      <Authors show={page === 'authors'} />
      <Books show={page === 'books'} />
      <Recommend show={page === 'recommend'} />
      <NewBook
        show={page === 'add'}
        setPage={setPage} 
        setError={notify}
      />
      <LoginForm
        show={page === 'login'} 
        setToken={setToken}
        setPage={setPage} 
        setError={notify}
      />
    </div>
  )
}

export default App
