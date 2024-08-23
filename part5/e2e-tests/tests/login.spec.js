const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, postNewBlog } = require('./helper')

const username = 'abc'
const password = 'example'
const name = 'def'

function generateRandomAlphanumeric(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length)
    result += characters[randomIndex]
  }
  return result
}


describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    // empty the database
    await request.post('http://localhost:3003/api/testing/reset')

    await page.goto('http://localhost:5173')

    // create a user
    await request.post('http://localhost:3003/api/users', {
      data: {
        username, password, name,
      }
    })
  })

  test('Login form is shown', async ({ page }) => {
    const loginButton = await page.getByRole('button', { name: /log in/i })
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, username, password)

      const loggedInRegex = new RegExp(`logged in as[: "]*${name}[" ]*`, 'i')

      await expect(page.getByText(loggedInRegex)).toBeVisible()

    })

    test('fails with incorrect credentials', async ({ page }) => {
      await loginWith(page, username, 'wrongpassword')

      const failedLoginRegex = new RegExp('invalid username/password', 'i')

      await expect(page.getByText(failedLoginRegex)).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, username, password)
    })

    test('a new blog can be created', async ({ page }) => {
      const blogTitle = 'aids98v'
      const blogAuthor = '298cvmqp'
      const blogUrl = 'fmkldax'

      await postNewBlog(page, blogTitle, blogAuthor, blogUrl)

      await expect(page.locator('#blog-list').getByText(blogTitle, { exact: false })).toBeVisible()
    })

    const getLikes = (likesText) => {
      const numbersRegex = new RegExp('([0-9]+)')
      const matchResults = numbersRegex.exec(likesText)

      if (matchResults === null) {
        throw new Error(`Could not find how many likes in this text: "${likesText}"`)
      }

      return Number(matchResults[1])
    }

    test('a blog can be liked', async ({ page }) => {
      const blogTitle = generateRandomAlphanumeric(5)
      const blogAuthor = generateRandomAlphanumeric(5)
      const blogUrl = generateRandomAlphanumeric(5)

      await postNewBlog(page, blogTitle, blogAuthor, blogUrl)

      const initialBlogItem = await page.getByTestId('blog-item').filter({ hasText: blogTitle })
      await initialBlogItem.getByRole('button', { name: /show/i }).click()

      const initialLikes = getLikes(await initialBlogItem.getByTestId('blog-likes').innerText())

      await initialBlogItem.getByRole('button', { name: /like/i }).click()

      // wait for the notification to pop up before checking for how many likes again
      await page.getByTestId('notification').waitFor()

      const finalBlogItem = await page.getByTestId('blog-item').filter({ hasText: blogTitle })
      const finalLikes = getLikes(await finalBlogItem.getByTestId('blog-likes').innerText())

      await expect(finalLikes).toBe(initialLikes + 1)
    })
  })
})