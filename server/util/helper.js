require('module-alias/register')
const models = require('@db/models')

const f = async () => {
  const statObject = await models.Statistic.find(
  )
  console.log(JSON.stringify(statObject, null, 2))

  process.exit()
}

f()

// node helper.js