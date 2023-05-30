import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
  fragment BookDetails on Book {
    id
    title
    published
    genres
    author {
      name
      id
    }
  }
`

const AUTHOR_DETAILS = gql`
  fragment AuthorDetails on Author {
    id
    name
    born
    bookCount
  }
`

export const ALL_BOOKS = gql`
  query ($genre: String) {
    allBooks(genre: $genre) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`

export const ALL_AUTHORS = gql`
  query AllAuthors {
    allAuthors {
      ...AuthorDetails
    }
  }

  ${AUTHOR_DETAILS}
`

export const ADD_BOOK = gql`
  mutation AddBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`

export const EDIT_AUTHOR = gql`
  mutation ($name: String!, $setBornTo: Int!) {
    editAuthor(name: $name, setBornTo: $setBornTo) {
      ...AuthorDetails
    }
  }

  ${AUTHOR_DETAILS}
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
export const ME = gql`
  query {
    me {
      favoriteGenre
    }
  }
`
export const GENRES = gql`
  query {
    allGenres
  }
`

export const BOOK_ADDED = gql`
  subscription {
    bookAdded {
      ...BookDetails
    }
  }

  ${BOOK_DETAILS}
`
