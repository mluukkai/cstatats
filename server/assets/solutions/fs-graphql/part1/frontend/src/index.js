import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'

import { ApolloClient, InMemoryCache, ApolloProvider } from '@apollo/client'

import { getWsHttpSplitLink } from './util'

export const STORAGE_KEY = 'library-user-token'

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: getWsHttpSplitLink()
})

ReactDOM.createRoot(document.getElementById('root')).render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>
)