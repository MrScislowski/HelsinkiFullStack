
const loginWith = async (page, username, password) => {
  await page.getByRole('textbox', { name: /username/i }).fill(username)
  await page.getByRole('textbox', { name: /password/i }).fill(password)
  await page.getByRole('button', { name: /log in/i }).click()
}

export { loginWith }