import { useState, useEffect } from 'react'
import { useApolloClient, useSubscription } from '@apollo/client'
import Authors from './components/Authors'
import Books from './components/Books'
import LoginForm from './components/LoginForm'
import NewBook from './components/NewBook'

import { STORAGE_KEY } from './constants'
import Recommended from './components/Recommend'
import { BOOK_ADDED } from './queries'

import { updateCacheWith } from './components/NewBook'

const Notify = ({ errorMessage }) => {
  if (!errorMessage) {
    return null
  }
  return (
    <div
      style={{
        color: 'red',
        border: 'solid',
        borderWidth: 1,
        padding: 5,
        margin: 5,
      }}
    >
      {errorMessage}
    </div>
  )
}

const App = () => {
  const [errorMessage, setErrorMessage] = useState(null)
  const [page, setPage] = useState('books')
  const [token, setToken] = useState(null)
  const client = useApolloClient()

  useEffect(() => {
    const token = localStorage.getItem(STORAGE_KEY)
    if (token) {
      setToken(token)
    }
  }, [])

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newBook = subscriptionData.data.bookAdded
      notify(`new book added ${newBook.title} by ${newBook.author.name}`)
      updateCacheWith(client.cache, newBook)
    },
  })

  const notify = (message) => {
    setErrorMessage(message)
    setTimeout(() => {
      setErrorMessage(null)
    }, 10000)
  }

  const logout = () => {
    setToken(null)
    localStorage.clear()
    client.resetStore()
  }

  const inactive = { marginTop: 10 }
  const active = {
    marginTop: 10,
    fontWeight: 'bold',
    fontStyle: 'italic',
    backgroundColor: '#BEBEBE',
  }

  return (
    <div>
      <div>
        <button
          style={page === 'authors' ? active : inactive}
          onClick={() => setPage('authors')}
        >
          authors
        </button>
        <button
          style={page === 'books' ? active : inactive}
          onClick={() => setPage('books')}
        >
          books
        </button>
        {token && (
          <>
            <button
              style={page === 'recommend' ? active : inactive}
              onClick={() => setPage('recommend')}
            >
              recommend
            </button>
            <button
              style={page === 'add' ? active : inactive}
              onClick={() => setPage('add')}
            >
              add book
            </button>
            <button onClick={() => logout()}>logout</button>
          </>
        )}

        {!token && (
          <button
            style={page === 'login' ? active : inactive}
            onClick={() => setPage('login')}
          >
            login
          </button>
        )}
      </div>

      <Notify errorMessage={errorMessage} />

      <Authors show={page === 'authors'} />

      <Books show={page === 'books'} />

      <Recommended show={page === 'recommend'} />

      <NewBook show={page === 'add'} setPage={setPage} />

      <LoginForm
        show={page === 'login'}
        setPage={setPage}
        setToken={setToken}
        setError={notify}
      />
    </div>
  )
}

export default App
