const common = require('@root/config/common')

const MONGO_URL = process.env.MONGO_URL || 'mongodb://mongo:mongo@db/mongo'
const PORT = process.env.PORT || 8000
const ADMINS = ['mluukkai', 'jakousa', 'admin']
const SHIBBOLETH_HEADERS = [
  'uid',
  'givenname', // First name
  'mail', // Email
  'schacpersonaluniquecode', // Contains student number
  'sn', // Last name
]

const formProject = (p) => {
  if (!p) return null

  const formUser = u => ({
    last_name: u.last_name,
    first_names: u.first_names,
    username: u.username,
  })

  return {
    name: p.name,
    github: p.github,
    _id: p._id,
    meeting: p.meeting,
    users: p.users.map(formUser),
  }
}

module.exports = {
  ...common,
  formProject,
  SHIBBOLETH_HEADERS,
  MONGO_URL,
  PORT,
  ADMINS,
}
