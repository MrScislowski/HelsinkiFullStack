
const loginWith = async (page, username, password) => {
  await page.getByRole('textbox', { name: /username/i }).fill(username)
  await page.getByRole('textbox', { name: /password/i }).fill(password)
  await page.getByRole('button', { name: /log in/i }).click()
}

const postNewBlog = async (page, title, author, url) => {
  await page.getByRole('button', { name: /new blog/i }).click()

  await page.getByRole('textbox', { name: /title/i }).fill(title)
  await page.getByRole('textbox', { name: /author/i }).fill(author)
  await page.getByRole('textbox', { name: /url/i }).fill(url)

  await page.getByRole('button', { name: /create/i }).click()
}

export { loginWith, postNewBlog }