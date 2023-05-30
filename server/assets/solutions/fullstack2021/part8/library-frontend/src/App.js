import React, { useState, useEffect } from 'react'
import { useQuery, useApolloClient, useSubscription } from '@apollo/client'
import _ from 'lodash'

import { ALL_AUTHORS, ALL_BOOKS, BOOK_ADDED } from './queries'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommended from './components/Recommended'

const Notification = ({ notification }) => {
  if (!notification) {
    return null
  }

  return (
    <div style={{ color: notification.color, margin: 5, border: "solid", padding: 10 }}>
      {notification.message}
    </div>
  )
}

const App = () => {
  const [page, setPage] = useState('books')
  const [token, setToken] = useState()
  const [notification, setNotification] = useState(null)
  const authors = useQuery(ALL_AUTHORS)
  const books = useQuery(ALL_BOOKS)
  const client = useApolloClient()

  useEffect(() => {
    const value = localStorage.getItem('library-user-token')
    setToken(value)
  }, [])

  const updateCacheWith = (addedBook) => {
    const includedIn = (set, object) => 
      set.map(p => p.id).includes(object.id)  

    const dataInStore = client.readQuery({ query: ALL_BOOKS })

    if (!includedIn(dataInStore.allBooks, addedBook)) {
      addedBook.genres.concat(null).forEach( genre => {
        const dataInStore = client.readQuery({ query: ALL_BOOKS, variables: { genre } })
        if ( dataInStore ) {
          client.writeQuery({
            query: ALL_BOOKS,
            variables: { genre },
            data: { allBooks : dataInStore.allBooks.concat(addedBook) }
          })
        }
      })
    }   
  }

  useSubscription(BOOK_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const addedBook = subscriptionData.data.bookAdded
      setNotification({ message: `new book added ${addedBook.title} by ${addedBook.author.name}`, color: 'green' } )
      setTimeout(() => {
        setNotification(null)
      }, 4000)

      updateCacheWith(addedBook)
    }
  })

  const logout = () => {
    setToken(null)
    localStorage.clear('library-user-token')
    client.resetStore()
  }

  const label = (title, show=null) => {
    const titleToShow = show || title
    return page===title?<strong>{titleToShow}</strong>:titleToShow
  } 

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>{label('authors')}</button>
        <button onClick={() => setPage('books')}>{label('books')}</button>
        {token&&<button onClick={() => setPage('add')}>{label('add', 'add book')}</button>}
        {token&&<button onClick={() => setPage('recommended')}>{label('recommended')}</button>}
        {token?
          <button onClick={logout}>logout</button>:
          <button onClick={() => setPage('login')}>login</button> 
        }
      </div>

      <Notification notification={notification} />

      <Authors
        authors={authors.data ? authors.data.allAuthors : null}
        show={page === 'authors'}
      />

      <Books
        genres={books.data ? _.uniq(books.data.allBooks.flatMap(b => b.genres)) : []}
        show={page === 'books'}
      />

      <NewBook
        show={page === 'add'}
      />

      <Recommended 
        books={books.data ? books.data.allBooks : null}
        show={page === 'recommended'}
      />

      <Login
        setToken={setToken}
        setNotification={setNotification}
        changePage={() => setPage('books')}
        show={page === 'login'}
      />

    </div>
  )
}

export default App