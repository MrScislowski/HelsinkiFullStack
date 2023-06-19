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
    .post(baseUrl, newBlog, { headers: { Authorization: token } })
  return response.data
}

const amendBlog = async (modifiedBlog) => {
  const response = await axios
    .put(`${baseUrl}/${modifiedBlog.id}`, modifiedBlog, { headers: { Authorization: token } })
  return response.data
}

const deleteBlog = async (theBlog) => {
  const { id } = theBlog
  const response = await axios
    .delete(`${baseUrl}/${id}`, { headers: { Authorization: token } })
  return response.data
}

const deleteAllBlogs = async () => {
  const response = await axios.delete(`${baseUrl}/all`);
  return response.data
}

export default { getAll, setToken, postBlog, amendBlog, deleteBlog, deleteAllBlogs }