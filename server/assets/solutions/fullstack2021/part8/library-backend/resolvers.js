const { UserInputError, AuthenticationError, PubSub } = require('apollo-server')
const jwt = require('jsonwebtoken')

const JWT_SECRET = 'NEED_HERE_A_SECRET_KEY'
const Book = require('./models/book')
const Author = require('./models/author')
const User = require('./models/user')

const pubsub = new PubSub()

let books = null

module.exports =  {
  Query: {
    bookCount: () => Book.collection.countDocuments(),
    authorCount: () => Author.collection.countDocuments(),
    allBooks: (root, { genre }) => {
      if (genre) {
        return Book.find({
          genres: {
            $in: [ genre ]
          }
        }).populate('author')
      }

      return Book.find({}).populate('author')
  },
    allAuthors: async () => {
      books = await Book.find({})
      return Author.find({})
    },
    me: async (root, args, { currentUser }) => {
      return currentUser
    } 
  },
  Author: {
    bookCount: async (root) => {
      const booksOfAuthor = books.filter(b => b.author === root.id) 
      return booksOfAuthor.length
    }
  },
  Mutation: {
    addBook: async (root, { title, author: name, published, genres }, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      let author = await Author.findOne({ name })
      if (!author) {
        author = new Author({ name })
        try {
          await author.save()
        } catch (error) {
          throw new UserInputError(error.message, {
            invalidArgs: { name },
          })
        }
      }
      
      const book = new Book({ title, published, genres, author })
      
      try {
        await book.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: { name },
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: book })

      return book
    },
    editAuthor: async (root, { name, setBornTo }, { currentUser }) => {
      if (!currentUser) {
        throw new AuthenticationError("not authenticated")
      }

      const author = await Author.findOne({ name })
      author.born = setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new UserInputError(error.message, {
          invalidArgs: { name, setBornTo },
        })
      }
      return author
    },
    createUser: (root, { username, favoriteGenre }) => {
      const user = new User({ username, favoriteGenre })
  
      return user.save()
        .catch(error => {
          throw new UserInputError(error.message, {
            invalidArgs: args,
          })
        })
    },
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username })
  
      if ( !user || args.password !== 'secret' ) {
        throw new UserInputError("wrong credentials")
      }
  
      const userForToken = {
        username: user.username,
        id: user._id,
      }
  
      return { value: jwt.sign(userForToken, JWT_SECRET) }
    },
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterator(['BOOK_ADDED'])
    },
  }
}
