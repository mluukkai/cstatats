import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

describe('blog', () => {
  let onLike = jest.fn()

  beforeEach(() => {
    const blog = {
      title: 'Testing is easy',
      author: 'Kalle Ilves',
      url: 'http://lynx.fi/testing',
      likes: 5
    }

    render(<Blog
      blog={blog}
      likeBlog={onLike}
      removeBlog={() => {}}
    />)
  })

  test('renders by default only title and author', () => {
    const authorElement = screen.getByText('Kalle Ilves', { exact: false })
    expect(authorElement).toBeDefined()

    const titleElement = screen.getByText('Testing is easy',  { exact: false })
    expect(titleElement).toBeDefined()

    const urlElement = screen.queryByText('http://lynx.fi/testing')
    expect(urlElement).toBeNull()

    const likesElement = screen.queryByText('likes 5')
    expect(likesElement).toBeNull()
  })

  test('when expanded also url and like rendered', () => {
    const showButton = screen.getByText('view')
    userEvent.click(showButton)

    const urlElement = screen.getByText('http://lynx.fi/testing')
    expect(urlElement).toBeDefined()

    const likesElement = screen.getByText('5 likes')
    expect(likesElement).toBeDefined()
  })

  test('when liked twice, handler is called twice', () => {
    const showButton = screen.getByText('view')
    userEvent.click(showButton)

    const likeButton = screen.getByText('like')
    userEvent.click(likeButton)
    userEvent.click(likeButton)

    expect(onLike.mock.calls).toHaveLength(2)
  })
})