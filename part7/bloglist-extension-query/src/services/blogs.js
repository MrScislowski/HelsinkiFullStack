import axios from 'axios'
const baseUrl = '/api/blogs'
const initialData = require("../data/initialData.json");

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

const loadInitialBlogs = async () => {
  for (const blog of initialData) {
    await postBlog(blog)
  }
}

const addCommentToBlog = async (blogId, comment) => {
  const response = await axios.post(`${baseUrl}/${blogId}/comments`, {comment: comment});
  return response.data
}

const blogService = { getAll, setToken, postBlog, amendBlog, deleteBlog, deleteAllBlogs, loadInitialBlogs, addCommentToBlog }
export default blogService