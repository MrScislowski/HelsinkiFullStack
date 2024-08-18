import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const setToken = newToken => {
  token = `Bearer ${newToken}`
}

const postNew = (blog) => {
  const config = {
    headers: { Authorization: token },
  }

  const response = axios.post(baseUrl, blog, config)
  return response.data
}



export default { getAll, postNew, setToken }