import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom/extend-expect'
import AddBlogForm from './AddBlogForm'
import userEvent from '@testing-library/user-event'

test('form calls event handler it received with correct data', async () => {
  const addBlog = jest.fn()
  const user = userEvent.setup()

  const { container } = render(<AddBlogForm addBlog={addBlog} />)

  const exampleBlog = {
    title: 'pri',
    author: 'ori',
    url: 'tie',
  }

  let input = screen.getByPlaceholderText('blog title')
  await user.type(input, exampleBlog.title)
  input = screen.getByPlaceholderText('blog author')
  await user.type(input, exampleBlog.author)
  input = screen.getByPlaceholderText('blog url')
  await user.type(input, exampleBlog.url)

  const sendButton = container.querySelector('.add-blog-form-button')
  await user.click(sendButton)

  expect(addBlog.mock.calls).toHaveLength(1)
  expect(addBlog.mock.calls[0][0]).toEqual({ ...exampleBlog, likes: 0 })
})