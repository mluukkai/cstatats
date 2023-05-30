const { GraphQLError } = require('graphql')
const jwt = require('jsonwebtoken')

const { PubSub } = require('graphql-subscriptions')
const pubsub = new PubSub()

const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

let bookCache = null

const Query = {
  bookCount: async () => Book.countDocuments({}),
  authorCount: async () => Author.countDocuments({}),
  allBooks: async (root, { author, genre }) => {
    const query = {}

    if ( author ) {
      const authorInDb = await Author.findOne({ name: author })
      query.author = authorInDb.id
    }

    if ( genre ) {
      query.genres = genre
    }

    return Book.find(query).populate('author')
  },
  allAuthors: async (root, args, context, query) => {
    const fieldsNames = query.fieldNodes[0].selectionSet.selections.map(f => f.name.value)
    if (fieldsNames.includes('bookCount') ) {
      bookCache = await Book.find({})
    }
    return Author.find({})
  },
  me: (root, args, { currentUser }) => {
    return currentUser
  }
}

const authorResolver = {
  bookCount: async (root) => {
    if (bookCache) {
      return bookCache.filter(b => b.author.toString() === root.id).length
    }
    return Book.countDocuments({ author: root.id })
  },
}

const Mutation = {
  addBook: async (root, { title, author, published, genres }, { currentUser }) => {
    if (!currentUser) {
      throw new GraphQLError('Must be signed in', {
        extensions: { code: 'BAD_USER_INPUT' }
      })
    }
    
    let book = new Book({ title, published, genres })

    let authorInDb = await Author.findOne({ name: author })
   
    if (!authorInDb) {
      authorInDb = new Author({ name: author })
      try {
        await await authorInDb.save()
      } catch (error) {
        throw new GraphQLError('Saving author failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: { author },
            error
          }
        })
      }
    }

    book.author = authorInDb.id

    try {
      await book.save()
    } catch (error) {
      throw new GraphQLError('Saving book failed', {
        extensions: {
          code: 'BAD_USER_INPUT',
          invalidArgs: { title, published, genres },
          error: error.errors.title
        }
      })
    }

    book = await Book.findById(book.id).populate('author')

    pubsub.publish('BOOK_ADDED', { bookAdded: book })

    return book
  },
  editAurhor: async (root, { name, born }, { currentUser }) => {
    if (!currentUser) {
      throw new GraphQLError('Must be signed in', {
        extensions: { code: 'BAD_USER_INPUT' }
      })
    }

    let author = await Author.findOne({ name })
    if (author) {
      author.born = born
      await author.save()
    }

    return author
  },
  createUser: async (root, { username, favoriteGenre }) => {
    const user = new User({ username, favoriteGenre })

    return user.save()
      .catch(error => {
        throw new GraphQLError('Creating the user failed', {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.name,
            error
          }
        })
      })
  },
  login: async (root, { username, password }) => {
    const user = await User.findOne({ username })

    if ( !user || password !== 'secret' ) {
      throw new GraphQLError('wrong credentials', {
        extensions: {
          code: 'BAD_USER_INPUT'
        }
      })        
    }

    const userForToken = {
      username: user.username,
      id: user._id,
    }

    return { value: jwt.sign(userForToken, process.env.JWT_SECRET) }
  },
}
 
const Subscription = {
  bookAdded: {
    subscribe: () => pubsub.asyncIterator('BOOK_ADDED')
  }
}

module.exports = {
  Query,
  Author: authorResolver, 
  Mutation,
  Subscription
}