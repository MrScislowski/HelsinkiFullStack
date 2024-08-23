const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, postNewBlog } = require('./helper')

const users = [
  {
    username: 'user1',
    password: 'user1',
    name: 'First User',
  },
  {
    username: 'user2',
    password: 'user2',
    name: 'Second User',
  }
]

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

    // create users
    await Promise.all(
      users.map(user => request.post('http://localhost:3003/api/users', { data: { ...user } }))
    )
  })

  test('Login form is shown', async ({ page }) => {
    const loginButton = await page.getByRole('button', { name: /log in/i })
    await expect(loginButton).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
      await loginWith(page, users[0].username, users[0].password)

      const loggedInRegex = new RegExp(`logged in as[: "]*${users[0].name}[" ]*`, 'i')

      await expect(page.getByText(loggedInRegex)).toBeVisible()

    })

    test('fails with incorrect credentials', async ({ page }) => {
      await loginWith(page, users[0].username, 'wrongpassword')

      const failedLoginRegex = new RegExp('invalid username/password', 'i')

      await expect(page.getByText(failedLoginRegex)).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, users[0].username, users[0].password)
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

    test('a blog you post can be deleted', async ({ page }) => {
      const blogTitle = generateRandomAlphanumeric(5)
      const blogAuthor = generateRandomAlphanumeric(5)
      const blogUrl = generateRandomAlphanumeric(5)

      await postNewBlog(page, blogTitle, blogAuthor, blogUrl)

      const blogItem = await page.getByTestId('blog-item').filter({ hasText: blogTitle })
      await blogItem.getByRole('button', { name: /show/i }).click()

      page.on('dialog', dialog => dialog.accept())
      await blogItem.getByRole('button', { name: /remove/i }).click()

      await expect(page.getByTestId('blog-list')).not.toHaveText(blogTitle)
    })

    test('the remove button is only present on your blogs...', async ({ page }) => {
      const blogs = users.map(
        () => {
          return {
            title: generateRandomAlphanumeric(5),
            author: generateRandomAlphanumeric(5),
            url: generateRandomAlphanumeric(5),
          }
        }
      )

      // post blog1 as user1
      await postNewBlog(page, blogs[0].title, blogs[0].author, blogs[0].url)

      // log out, and sign in as user2
      await page.getByRole('button', { name: /log out/i }).click()
      await loginWith(page, users[1].username, users[1].password)

      // post blog2 as user2
      await postNewBlog(page, blogs[1].title, blogs[1].author, blogs[1].url)

      // delete button should exist on the blog I (user2) just posted
      const myBlogItem = await page.getByTestId('blog-item').filter({ hasText: blogs[1].title })
      await myBlogItem.getByRole('button', { name: /show/i }).click()
      await expect(myBlogItem.getByRole('button', { name: /remove/i })).toBeVisible()

      // delete button should not exist on the blog user1 posted
      const theirBlogItem = await page.getByTestId('blog-item').filter({ hasText: blogs[0].title })
      await theirBlogItem.getByRole('button', { name: /show/i }).click()
      await expect(theirBlogItem.getByRole('button', { name: /remove/i })).not.toBeVisible()
    })

    test('blogs are ordered from most to least', async ({ page }) => {
      // get unique numbers of likes
      const ordered_likes = [1, 2, 3, 4, 5]
      const likes = []

      // shuffle them
      while (ordered_likes.length > 0) {
        const [curNum] = ordered_likes.splice(Math.floor(Math.random() * ordered_likes.length), 1)
        likes.push(curNum)
      }

      // define a bunch of blogs
      const blogs = likes.map(
        (numLikes) => {
          return {
            title: generateRandomAlphanumeric(5),
            author: generateRandomAlphanumeric(5),
            url: generateRandomAlphanumeric(5),
            likes: numLikes,
          }
        }
      )

      // post all of the blogs:
      //  doing this using .map doesn't work, because they're all trying to edit the form elements at once...
      for (let blog of blogs) {
        await postNewBlog(page, blog.title, blog.author, blog.url)
      }

      // 'like' each blog the correct number of times - define function
      const likeBlog = async (blog) => {
        let blogLocator = await page.getByTestId('blog-item').filter({ hasText: blog.title })
        if (! await blogLocator.getByRole('button', { name: /like/i }).isVisible()) {
          await blogLocator.getByRole('button', { name: /show/i }).click()
          blogLocator = await page.getByTestId('blog-item').filter({ hasText: blog.title })
        }

        await blogLocator.getByRole('button', { name: /like/i }).click()
      }

      // use function
      for (let blog of blogs) {
        for (let i = 0; i < blog.likes; i++) {
          await likeBlog(blog)
        }
      }

      // inspect the order of the blogs
      // check there are the correct number...
      await expect(page.getByTestId('blog-item')).toHaveCount(blogs.length)

      // check the order is correct
      const expectedText = blogs.sort((blog1, blog2) => blog2.likes - blog1.likes).map(blog => new RegExp(blog.title, 'i'))
      await expect(page.getByTestId('blog-item')).toHaveText(expectedText)

    })
  })
})