const listHelper = require('../utils/list_helper')

const blogs = [
  {
    _id: "5a422a851b54a676234d17f7",
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
    __v: 0
  },
  {
    _id: "5a422aa71b54a676234d17f8",
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html",
    likes: 5,
    __v: 0
  },
  {
    _id: "5a422b3a1b54a676234d17f9",
    title: "Canonical string reduction",
    author: "Edsger W. Dijkstra",
    url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
    likes: 12,
    __v: 0
  },
  {
    _id: "5a422b891b54a676234d17fa",
    title: "First class tests",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/05/05/TestDefinitions.htmll",
    likes: 10,
    __v: 0
  },
  {
    _id: "5a422ba71b54a676234d17fb",
    title: "TDD harms architecture",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
    likes: 0,
    __v: 0
  },
  {
    _id: "5a422bc61b54a676234d17fc",
    title: "Type wars",
    author: "Robert C. Martin",
    url: "http://blog.cleancoder.com/uncle-bob/2016/05/01/TypeWars.html",
    likes: 2,
    __v: 0
  }  
]

const listWithOneBlog = [blogs[1]]

test('dummy returns one', () => {
  const blogs = []

  const result = listHelper.dummy(blogs)
  expect(result).toBe(1)
})

describe('total likes', () => {
  test('there are none if the list is empty', () => {
    const result = listHelper.totalLikes([])
    expect(result).toBe(0)
  })

  test('when the list has only one blog equals the likes of that', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    expect(result).toBe(5)
  })

  test('when the list has many blogs, it is the sum of all likes', () => {
    const result = listHelper.totalLikes(blogs)
    expect(result).toBe(36)
  })
})

describe('favorite blog', () => {
  test('there is none if the list is empty', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })

  test('when the list has only one blog, it is the one', () => {
    const result = listHelper.favoriteBlog(listWithOneBlog)
    expect(result).toBe(listWithOneBlog[0])
  })

  test('when the list has many blogs, it is the one with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    expect(result).toBe(blogs[2])
  })
})

describe('most blogs', () => {
  test('nobody if the list is empty', () => {
    const result = listHelper.favoriteBlog([])
    expect(result).toBe(null)
  })

  test('when list has only one blog, it is the author of that', () => {
    const result = listHelper.mostBlogs(listWithOneBlog)
    expect(result).toBe('Edsger W. Dijkstra')
  })
   
  test('when the list has many blogs, it is the author that has written most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    expect(result).toBe('Robert C. Martin')
  })
})

describe('most likes', () => {
  test('nobody if the list is empty', () => {
    const result = listHelper.mostLikes([])
    expect(result).toBe(null)
  })

  test('when list has only one blog, it is the author of that', () => {
    const result = listHelper.mostLikes(listWithOneBlog)
    expect(result).toBe('Edsger W. Dijkstra')
  })

  test('when the list has many blogs, it is the author that has written most likes in the written blogs', () => {
    const result = listHelper.mostLikes(blogs)
    expect(result).toBe('Edsger W. Dijkstra')
  })
})