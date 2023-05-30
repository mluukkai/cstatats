const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((sum, blog) => blog.likes + sum, 0)
}

const favoriteBlog = (blogs) => {
  if ( blogs.length === 0) {
    return null
  }

  let best = blogs[0]

  blogs.forEach(blog => {
    if ( blog.likes > best.likes ) {
      best = blog
    }
  })

  return best
}

const mostBlogs = (blogs) => {
  if ( blogs.length === 0) {
    return null
  }

  const byAuthor = _.groupBy(blogs, (b) => b.author)
  const authors = Object.keys(byAuthor)
  let withMost = authors[0]
  
  authors.forEach(author => {
    if (byAuthor[author].length > byAuthor[withMost].length) {
      withMost = author
    }
  })

  return withMost
}

const mostLikes = (blogs) => {
  const likes = (blogs) => blogs.reduce((sum, b) => sum + b.likes, 0)

  if ( blogs.length === 0) {
    return null
  } 

  const byAuthor = _.groupBy(blogs, (b) => b.author)
  const authors = Object.keys(byAuthor)
  let withMost = authors[0]
  
  authors.forEach(author => {
    if (likes(byAuthor[author]) > likes(byAuthor[withMost])) {
      withMost = author
    }
  })

  return withMost  
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}