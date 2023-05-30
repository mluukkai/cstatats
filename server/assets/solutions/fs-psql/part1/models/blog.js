
const { Model, DataTypes } = require('sequelize')

const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  author: {
    type: DataTypes.TEXT,
  },  
  likes: {
    type: DataTypes.INTEGER,
    defaultValue: 0,
    validate: {
      isInt: true,
      min: 0
    }
  },
  year: {
    type: DataTypes.INTEGER,
    validate: {
      isInt: true,
      min: 1991,
      greaterThanCurrent(value) {
        const current = new Date().getFullYear()
        if (parseInt(value) > current) {
          throw new Error(`year can not be greater than ${current}`);
        }
      }
    }
  }
}, {
  sequelize,
  underscored: true,
  modelName: 'blog'
})

module.exports = Blog