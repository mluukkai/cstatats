const { MongoClient, ObjectId } = require('mongodb')

// Connection URL
const url = 'mongodb://root:root@localhost:27017/'

// Database Name
const dbName = 'mongo'

// Use connect method to connect to the server
MongoClient.connect(url, async (err, client) => {
  if (err) return console.log(err)
  console.log('Connected successfully to server')

  const db = client.db(dbName)
  const allSubs = await db.collection('statssubmissions').find().toArray()

  allSubs.forEach(sub => {
    console.log(sub.exercises.length)
  })
  client.close()
})
