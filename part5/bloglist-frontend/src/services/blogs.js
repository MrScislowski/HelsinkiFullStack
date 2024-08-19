import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const postNew = async (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = await axios.post(baseUrl, blog, config)
  return response.data
}

const putAmended = async (blog) => {
  const config = {
    headers: {Authorization: token },
  }

  const blogData = {
    ...blog,
    user: blog.user.id,
  }

  const response = await axios.put(`${baseUrl}/${blog.id}`, blogData, config)
  return response.data
}

const deleteBlog = async (blog) => {
  const config = {
    headers: {Authorization: token },
  }

  const response = await axios.delete(`${baseUrl}/${blog.id}`, config)
  return response.data
}



export default { getAll, postNew, setToken, putAmended, deleteBlog }