import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'

test('blog components render title and author, but not url or number of likes', () => {
  const blog = {
    title: 'abc',
    author: 'def',
    url: 'ghi',
    likes: 49,
  }

  const { container } = render(<Blog blog={blog} />)

  const element = container.querySelector('.basic-blog-content')
  expect(element).toHaveTextContent(blog.title)
  expect(element).toHaveTextContent(blog.author)
  expect(element).not.toHaveTextContent(blog.url)
  expect(element).not.toHaveTextContent(blog.likes)
  expect(container.querySelector('.detailed-blog-content')).toHaveStyle('display: none')
})

test('url and likes are shown when the show button has been clicked', async () => {
  const blog = {
    title: 'abc',
    author: 'def',
    url: 'ghi',
    likes: 49,
  }

  const user = userEvent.setup()
  const { container } = render(<Blog blog={blog} />)
  const button = container.querySelector('.visibility-button')
  await user.click(button)

  const element = container.querySelector('.detailed-blog-content')
  expect(element).not.toHaveStyle('display: none')
  expect(element).toHaveTextContent(blog.url)
  expect(element).toHaveTextContent(blog.likes)
})