require('module-alias/register')
const models = require('@db/models')

const f = async () => {
  const users = await models.User.find(
  )
  console.log(users.length)

  process.exit()
}

f()

// node helper.js