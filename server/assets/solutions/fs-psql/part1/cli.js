require('dotenv').config()
const { Sequelize, QueryTypes } = require('sequelize')

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false
    }
  },
});

const main = async () => {
  try {
    await sequelize.authenticate()
    const notes = await sequelize.query("SELECT * FROM blogs", { type: QueryTypes.SELECT })
    notes.forEach(({ title, author, likes }) => {
      console.log(`${author}: '${title}', ${likes} likes`)
    })
    sequelize.close()
  } catch (error) {
    console.error('Unable to connect to the database:', error)
  }
} 

main()