
require('dotenv').config()

module.exports = {
  DATABASE_URL: process.env.DATABASE_URL,
  PORT: process.env.PORT || 3001,
  SECRET: 'b1gs3cr3t'
}