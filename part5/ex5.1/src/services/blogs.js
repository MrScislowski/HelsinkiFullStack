import axios from 'axios'
const baseUrl = '/api/blogs'

let token = null

const setToken = (newValue) => {
  token = `bearer ${newValue}`
}

const getAll = () => {
  const request = axios.get(baseUrl)
  return request.then(response => response.data)
}

const postBlog = async (newBlog) => {
  // title: String,
  // author: String,
  // url: String,
  // likes: Number,
  const response = await axios
    .post(baseUrl, newBlog, {headers: {Authorization: token}})
  return response.data
}

export default { getAll, setToken, postBlog }