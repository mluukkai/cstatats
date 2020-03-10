const { MongoClient, ObjectId } = require('mongodb')

// Connection URL
const url = 'mongodb://root:root@localhost:27017/'

// Database Name
const dbName = 'mongo'

const oldBackendCourses = ['', 'docker2019', 'fs', 'ofs2019', 'ofs', 'stats']

const oldBackendTableNames = ['courses', 'users', 'submissions', 'projects']

const possibleTables = ['courses', 'docker2019courses', 'docker2019submissions', 'docker2019users', 'fscourses', 'fssubmissions', 'fsusers', 'ofs2019courses', 'ofs2019statsextensions', 'ofs2019submissions', 'ofs2019users', 'ofscourses', 'ofssubmissions', 'ofsusers', 'projects', 'statscourses', 'statsextensions', 'statsprojects', 'statssubmissions', 'statsusers', 'submissions', 'users']

const moveCourses = async (from, to, courseName) => {
  try {
    const oldData = await from.find({}).toArray()
    const withFields = oldData.map(course => ({
      year: 1970,
      term: 'Unknown term',
      fullName: course.name,
      ...course,
    }))
    await to.insertMany(withFields)
  } catch (err) {
    if (err.message.includes('duplicate key')) return // duplicate means already doned
    console.log('Failed, courses', courseName)
  }
  console.log('Moved courses successfully')
}

const moveUsers = async (from, to, courseName) => {
  try {
    const oldData = await from.find({}).toArray()
    const withFields = oldData.map(user => {
      const courseProgress = (user.random || user.completed || user.grading)
        ? [{ courseName, random: user.random, completed: user.completed, grading: user.grading }]
        : []

      let extensions
      if (user.extensions && user.extensions.length) {
        extensions = user.extensions
      } else {
        extensions = (user.extensions && (user.extensions.from || user.extensions.extendsWith))
          ? [{ to: courseName, courseName, ...user.extensions }]
          : []
      }
      return {
        mergedFromTable: courseName,
        ...user,
        courseProgress,
        extensions
      }
    })
    await to.insertMany(withFields)
  } catch (err) {
    if (err.message.includes('duplicate key')) return // duplicate means already doned
    console.log('Failed, users', courseName)
  }
}

const moveSubmissions = async (from, to, courseName) => {
  try {
    const oldData = await from.find({}).toArray()
    const withFields = oldData.map(submission => ({
      courseName,
      ...submission,
    }))
    await to.insertMany(withFields)
  } catch (err) {
    if (err.message.includes('duplicate key')) return // duplicate means already doned
    console.log('Failed, submissions', courseName)
  }
}

const moveProjects = async (from, to, courseName) => {
  try {
    const oldData = await from.find({}).toArray()
    const withFields = oldData.map(project => ({
      courseName,
      ...project,
    }))
    await to.insertMany(withFields)
  } catch (err) {
    if (err.message.includes('duplicate key')) return // duplicate means already doned
    console.log('Failed, projects', courseName)
  }
}

const moveExtensions = async (from, to, courseName) => {
  try {
    const oldData = await from.find({}).toArray()
    const withFields = oldData.map(extension => ({
      courseName,
      ...extension,
    }))
    await to.insertMany(withFields)
  } catch (err) {
    if (err.message.includes('duplicate key')) return // duplicate means already doned
    console.log('Failed, projects', courseName)
  }
}

const moveDocumentsFrom = async (db, courseName, tableName) => {
  const from = `${courseName}${tableName}`
  if (!possibleTables.includes(from)) return true
  const to = `mergele${tableName}`
  const fromCollection = db.collection(from)
  const toCollection = db.collection(to)

  const finalCourseName = courseName || 'ohtus17'
  switch (tableName) {
    case 'courses':
      return moveCourses(fromCollection, toCollection, finalCourseName)
    case 'users':
      return moveUsers(fromCollection, toCollection, finalCourseName)
    case 'submissions':
      return moveSubmissions(fromCollection, toCollection, finalCourseName)
    case 'projects':
      return moveProjects(fromCollection, toCollection, finalCourseName)
    default:
      break
  }
  console.log('Fakd', finalCourseName)
}

const mergeUsers = async (db) => {
  const users = db.collection('mergeleusers')
  const allUsers = await users.find({}).toArray()
  const duplicateUserIdMap = {} // from: to
  for (const user of allUsers) {
    const deprecatedIds = Object.keys(duplicateUserIdMap)
    const duplicate = allUsers.find(u =>
      u.username === user.username &&
      u._id.toString() !== user._id.toString() &&
      !deprecatedIds.includes(u._id.toString())
    )
    if (!duplicate) continue
    const oldId = user._id.toString()
    const newId = duplicate._id.toString()
    if (duplicateUserIdMap[oldId]) console.log('JOSTAIN SYYSTÄ VANHA ID ON JO SIELLÄ')
    if (duplicateUserIdMap[newId]) console.log('ON JO DEPREKOITUVANA ANTAVANA OSAPUOLENA')
    if (Object.values(duplicateUserIdMap).includes(newId)) console.log('Joku muu mäppääntyy jo tähän, is ok')
    duplicateUserIdMap[oldId] = newId
  }
  const trivialMerge = (a, b, field) => a[field] || b[field]
  const arrayMerge = (a, b, field) => [...(a[field] || []), ...(b[field] || [])]

  for (const oldId of Object.keys(duplicateUserIdMap)) {
    // Merge users
    const newId = duplicateUserIdMap[oldId]
    const newUser = await users.findOne(new ObjectId(newId))
    const oldUser = await users.findOne(new ObjectId(oldId))
    const triviallyMergedFields = ["student_number", "token", "email", "name", "hy_email", "admin", "first_names", "last_name"]
    let mergedUser = {}
    triviallyMergedFields.forEach(field => mergedUser[field] = trivialMerge(newUser, oldUser, field))
    mergedUser.submissions = arrayMerge(newUser, oldUser, "submissions")
    mergedUser.project = trivialMerge(newUser, oldUser, "project") // Refactor to support multiple projects some other day
    mergedUser.peerReview = trivialMerge(newUser, oldUser, "peerReview") // <- Projects have peerreviews, same as above
    mergedUser.quizAnswers = arrayMerge(newUser, oldUser, "quizAnswers")
    mergedUser.projectAccepted = trivialMerge(newUser, oldUser, "projectAccepted")

    mergedUser.extensions = arrayMerge(newUser, oldUser, "extensions")
    mergedUser.courseProgress = arrayMerge(newUser, oldUser, "courseProgress")

    mergedUser.project = new ObjectId(mergedUser.project)
    mergedUser.submissions = mergedUser.submissions.map(s => new ObjectId(s))
    await users.updateOne({ _id: new ObjectId(newUser._id) }, { $set: mergedUser }, { upsert: true })
    await users.deleteOne({ _id: new ObjectId(oldUser._id) })
  }

  await replaceUserIds(duplicateUserIdMap, db.collection('mergeleextensions'))
  await replaceUserIds(duplicateUserIdMap, db.collection('mergelesubmissions'))
  await replaceProjectUserIds(duplicateUserIdMap, db.collection('mergeleprojects'))
}

const replaceUserIds = async (userIdMap, collection) => {
  const userIds = Object.keys(userIdMap)
  for (const userId of userIds) {
    const update = { _id: new ObjectId(userIdMap[userId]) }
    await collection.updateOne({ _id: new ObjectId(userId) }, { $set: update })
  }
}

const replaceProjectUserIds = async (userIdMap, collection) => {
  const projects = await collection.find({}).toArray()
  for (const project of projects) {
    const newUsers = project.users.map(u => {
      const newId = userIdMap[u.toString()]
      if (!newId) return u
      return new ObjectId(newId)
    })
    await collection.updateOne({ _id: new ObjectId(project._id) }, { $set: { users: newUsers } })
  }
}

const mergeTables = async (db) => {
  for (const courseName of oldBackendCourses) {
    for (const tableName of oldBackendTableNames) {
      await moveDocumentsFrom(db, courseName, tableName)
      console.log(`MOVED ${courseName} ${tableName}`)
    }
  }
  await moveExtensions(
    db.collection('ofs2019statsextensions'),
    db.collection('mergeleextensions'),
    'ofs2019',
  )
  await moveExtensions(
    db.collection('statsextensions'),
    db.collection('mergeleextensions'),
    'stats'
  )
  console.log('Moved ofs2019statsextensions to statsextensions')

}

// Use connect method to connect to the server
MongoClient.connect(url, async (err, client) => {
  if (err) return console.log(err)
  console.log('Connected successfully to server')

  const db = client.db(dbName)
  await db.collection('statsusers').drop()
  await db.collection('statscourses').drop()
  await db.collection('statsextensions').drop()
  await db.collection('statssubmissions').drop()
  await db.collection('statsprojects').drop()
  await db.collection('oldstatsusers').rename("statsusers")
  await db.collection('oldstatscourses').rename("statscourses")
  await db.collection('oldstatsextensions').rename("statsextensions")
  await db.collection('oldstatssubmissions').rename("statssubmissions")
  await db.collection('oldstatsprojects').rename("statsprojects")
  await mergeTables(db)
  await mergeUsers(db)
  await db.collection('statsusers').rename("oldstatsusers")
  await db.collection('statscourses').rename("oldstatscourses")
  await db.collection('statsextensions').rename("oldstatsextensions")
  await db.collection('statssubmissions').rename("oldstatssubmissions")
  await db.collection('statsprojects').rename("oldstatsprojects")
  await db.collection('mergeleusers').rename("statsusers")
  await db.collection('mergelecourses').rename("statscourses")
  await db.collection('mergeleextensions').rename("statsextensions")
  await db.collection('mergelesubmissions').rename("statssubmissions")
  await db.collection('mergeleprojects').rename("statsprojects")
  client.close()
})
