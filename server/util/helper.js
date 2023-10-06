require('module-alias/register')
const models = require('@db/models')
const courses = require('@controllers/coursesController')

const f = async () => {
  const users = await models.User.find(
  )
  console.log(users.length)

  const data = await courses.getCurrentStats2('ofs2019')
  console.log(data)


  process.exit()
}

f()

// node helper.js