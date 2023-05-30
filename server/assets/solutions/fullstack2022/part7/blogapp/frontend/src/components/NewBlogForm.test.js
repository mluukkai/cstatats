import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import NewBlogForm from './NewBlogForm'

it('when blog is created, callback has correct data', () => {
  const onCreate = jest.fn()
  render(<NewBlogForm onCreate={onCreate} />)

  const blogToCreate = {
    author: 'Kalle Ilves',
    title: 'Testing is pretty easy',
    url: 'https://testing-library.com/docs/react-testing-library/intro/',
    likes: 0,
  }

  const authorInput = screen.getByPlaceholderText('author of the blog')
  userEvent.type(authorInput, blogToCreate.author)

  const titleInput = screen.getByPlaceholderText('title of the blog')
  userEvent.type(titleInput, blogToCreate.title)

  const urlInput = screen.getByPlaceholderText('url of the blog')
  userEvent.type(urlInput, blogToCreate.url)

  const createButton = screen.getByText('create')
  userEvent.click(createButton)

  expect(onCreate.mock.calls[0][0]).toEqual(blogToCreate)
})
