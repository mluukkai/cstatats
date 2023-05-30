const { ApolloServer } = require('apollo-server-express')
const { ApolloServerPluginDrainHttpServer } = require('apollo-server-core')
const { makeExecutableSchema } = require('@graphql-tools/schema')
const { execute, subscribe } = require('graphql')
const { SubscriptionServer } = require('subscriptions-transport-ws')
const express = require('express')
const http = require('http')

require('dotenv').config()

const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI

console.log('connecting to', MONGODB_URI)

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const context = require('./context')

const start = async () => {
  const app = express()
  const httpServer = http.createServer(app)

  const schema = makeExecutableSchema({ typeDefs, resolvers })
  const subscriptionServer = SubscriptionServer.create(
    {
      schema,
      execute,
      subscribe,
    },
    {
      server: httpServer,
      path: '',
    }
  )

  const server = new ApolloServer({
    schema,
    context,
    plugins: [
      ApolloServerPluginDrainHttpServer({ httpServer }),
      {
        async serverWillStart() {
          return {
            async drainServer() {
              subscriptionServer.close()
            },
          }
        },
      },
    ],
  })

  await server.start()

  server.applyMiddleware({
    app,
    path: '/',
  })

  const PORT = process.env.PORT
  httpServer.listen(PORT, () =>
    console.log(`Server is now running on http://localhost:${PORT}`)
  )
}

start()
