const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
  {
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
  },
  {
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
  },
]

const blogsInDb = async () => {
  const notes = await Blog.find({})
  return notes.map(note => note.toJSON())
}

const userInDb = async () => {
  return await User.findOne({})
}

module.exports = {
  initialBlogs,
  blogsInDb,
  userInDb
}