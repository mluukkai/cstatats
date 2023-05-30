const { before } = require('lodash')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const Blog = require('../models/blog')
const User = require('../models/user')
const { initialBlogs, blogsInDb, userInDb } = require('./test_helper')

const api = supertest(app)

describe('when there are some blogs in database', () => {
  beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})

    const testUser = {
      username: "tester",
      password: "secred"
    }
  
    await api
      .post('/api/users')
      .send(testUser)
      .expect(200)

    const user = await userInDb()

    let blog = new Blog(initialBlogs[0])
    
    blog.user = user


    await blog.save()
    user.blogs = user.blogs.concat(blog)

    blog = new Blog(initialBlogs[1])
    blog.user = user
    await blog.save()
    user.blogs = user.blogs.concat(blog)

    await user.save()
  })

  test('those are returned as json', async () => {
    const response = await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)

      expect(response.body).toHaveLength(initialBlogs.length)
  })

  test('those have identifier id', async () => {
    const response = await api
      .get('/api/blogs')

    expect(response.body[0].id).toBeDefined()
    expect(response.body[0]._id).not.toBeDefined()
  })

  test('those can be deleted', async () => {
    const response = await api
      .post(`/api/login/`)
      .send({
        username: "tester",
        password: "secred"
      })

    const { token } = response.body

    const blogsBefore = await blogsInDb()

    await api
      .delete(`/api/blogs/${blogsBefore[0].id}`)
      .set('Authorization', `bearer ${token}`)
      .expect(204)

    const blogsAfter = await blogsInDb()

    expect(blogsAfter).toHaveLength(initialBlogs.length-1)
  })

  test('those can be edited', async () => {
    const blogsBefore = await blogsInDb()
    const editedBlog = blogsBefore[0]
    const likesAtStart = editedBlog.likes
    editedBlog.likes += 1

    const response = await api
      .put(`/api/blogs/${blogsBefore[0].id}`)
      .send(editedBlog)
      .expect(200)

    const blogsAfter = await blogsInDb()
    expect(blogsAfter[0].likes).toBe(likesAtStart + 1)
  })

  describe('additon of a blog', () => {
    let token = null
    beforeEach(async () => {
      const response = await api
      .post(`/api/login/`)
      .send({
        username: "tester",
        password: "secred"
      })

      token  = response.body.token
    })

    test('succeeds with valid fields', async () => {
      const newBlog = {
        title: "Goto considered harmful",
        author: "Edsger W. Dijkstra",
        url: "http://ewd.nl/goto.html",
        likes: 100,
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const blogsAfter = await blogsInDb()
    
      expect(blogsAfter).toHaveLength(initialBlogs.length + 1)
      const contents = blogsAfter.map(({ title, author }) => ({ title, author } ))
      expect(contents).toContainEqual({
        title: "Goto considered harmful",
        author: "Edsger W. Dijkstra",
      })
    })

    test('initializes likes to zero by default', async () => {
      const newBlog = {
        author: "Bernrand Meyer",
        title: "Touch of Class: Learning to Program Well with Objects and Contracts",
        url: "http://www.google.com",
      }
    
      const respone = await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(201)
        .expect('Content-Type', /application\/json/)
    
      const blogsAfter = await blogsInDb()
      const addedBlog = blogsAfter.find(b => b.title === newBlog.title)
  
      expect(addedBlog.likes).toBe(0)
      expect(respone.body.likes).toBe(0)
    })  

    test('fails without title', async () => {
      const newBlog = {
        author: "Edsger W. Dijkstra",
        url: "http://www.google.com",
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })   
    
    test('fails without tilte', async () => {
      const newBlog = {
        author: "Edsger W. Dijkstra",
        title: "Primer of Algol 60 Programming,",
      }
    
      await api
        .post('/api/blogs')
        .send(newBlog)
        .set('Authorization', `bearer ${token}`)
        .expect(400)
        .expect('Content-Type', /application\/json/)
    })      
  })
})

afterAll(() => {
  mongoose.connection.close()
})