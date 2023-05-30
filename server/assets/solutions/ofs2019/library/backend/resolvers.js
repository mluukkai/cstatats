const mongoose = require('mongoose')
const { UserInputError, AuthenticationError } = require('apollo-server')

const jwt = require('jsonwebtoken')
const _ = require('lodash')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'

const User = require('./models/user')
const Book = require('./models/book')
const Author = require('./models/author')

let books

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, { author, genre }) => {
      const query = {}
      if (genre) {
        query.genres = { $in: [genre] }
      }

      if (author) {
        const authorObject = await Author.findOne({ name: author })
        query.author = mongoose.Types.ObjectId(authorObject._id)
      }

      return Book.find(query).populate('author')
    },
    allAuthors: async (root, args, context, query) => {
      const selections = _.flatMap(
        query.fieldNodes.map((node) =>
          node.selectionSet.selections.map((s) => s.name.value)
        )
      )
      if (selections.includes('bookCount')) {
        console.log('Book.find')
        books = await Book.find({})
      }

      console.log('Author.find')
      return await Author.find({})
    },
    me: (root, args, { currentUser }) => {
      return currentUser
    },
    allGenres: async () => {
      const books = await Book.find({})
      const genres = _.uniq(_.flatMap(books.map((b) => b.genres)))
      return genres
    },
  },
  Author: {
    bookCount: async (root, args) => {
      let booksOfAuthor
      if (books) {
        booksOfAuthor = books.filter(
          (b) => b.author.toString() === root._id.toString()
        )
      } else {
        console.log('Book.find')
        booksOfAuthor = await Book.find({
          author: mongoose.Types.ObjectId(root._id),
        })
      }
      return booksOfAuthor.length
    },
  },
  Mutation: {
    addBook: async (root, args, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      let author = await Author.findOne({ name: args.author })
      if (!author) {
        author = new Author({ name: args.author })

        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        }
      }

      let book = new Book({ ...args, author: author.id })

      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      }

      book = await Book.findById(book.id).populate('author')

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError('not authenticated')
      }

      const author = await Author.findOne({ name })
      if (author) {
        author.born = setBornTo
      }

      await author.save()

      return author
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new UserInputError('wrong credentials')
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      }

      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
    createUser: async (root, args) => {
      const user = new User({ ...args })

      return user.save().catch((error) => {
        throw new UserInputError(error.message, {
          invalidArgs: args,
        })
      })
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED']),
    },
  },
}

module.exports = resolvers
