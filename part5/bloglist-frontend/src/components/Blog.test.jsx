import { render, screen } from '@testing-library/react'
import { expect } from 'vitest'
import Blog from './Blog'

test('renders blog title and author, but not URL / number of likes', () => {
  const titleText = 'abc'
  const authorText = 'def'
  const urlText = 'ghi'
  const likesValue = 19
  const userName = 'jkl'

  const blog = {
    id: '000',
    user: { id: '000', username: '000', name: userName },
    title: titleText,
    author: authorText,
    url: urlText,
    likes: likesValue,
  }

  render(<Blog blog={blog} blogs={[]} setBlogs={() => false} setNotification={() => false} />)

  const foundTitle = screen.getByText(titleText, { exact: false })
  expect(foundTitle).toBeTruthy()

  const foundAuthor = screen.getByText(authorText, { exact: false })
  expect(foundAuthor).toBeTruthy()

  const foundUrl = screen.queryByText(urlText, { exact: false })
  expect(foundUrl).toBeNull()

  const foundLikes = screen.queryByText(likesValue, { exact: false })
  expect(foundLikes).toBeNull()

})