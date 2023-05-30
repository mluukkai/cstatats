const { ApolloServer } = require('apollo-server')
require('dotenv').config()
const mongoose = require('mongoose')

const typeDefs = require('./typedefs')
const resolvers = require('./resolvers')
const context = require('./context')

mongoose.connect(process.env.MONGODB_URI , { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })
  .then(() => {
    console.log('connected to MongoDB', process.env.MONGODB_URI )
  })
  .catch((error) => {
    console.log('error connecting to MongoDB:', error.message)
  })

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context
})

server.listen().then(({ url }) => {
  console.log(`Server ready at ${url}`)
})