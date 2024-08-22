const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith } = require('./helper')

const username = 'abc'
const password = 'example'
const name = 'def'

describe('Blog app', () => {
  beforeEach(async ({ page, request }) => {
    await page.goto('http://localhost:5173')

    // empty the database
    await request.post('http://localhost:3003/api/testing/reset')

    // create a user
    const response = await request.post('http://localhost:3003/api/users', {
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

      const failedLoginRegex = new RegExp(`invalid username/password`, 'i')

      await expect(page.getByText(failedLoginRegex)).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) =>{
      await loginWith(page, username, password)
    })

    test('a new blog can be created', async ({ page }) => {
      const blogTitle = 'aids98v'
      const blogAuthor = '298cvmqp'
      const blogUrl = 'fmkldax'

      await page.getByRole('button', { name: /new blog/i }).click()

      await page.getByRole('textbox', { name: /title/i }).fill(blogTitle)
      await page.getByRole('textbox', { name: /author/i }).fill(blogAuthor)
      await page.getByRole('textbox', { name: /url/i }).fill(blogUrl)

      await page.getByRole('button', { name: /create/i }).click()

      await expect(page.getByText(`${blogTitle} ${blogAuthor} show`, { exact: false })).toBeVisible()

    })
  })
})