import axios from "axios"

const baseUrl = 'http://localhost:3001/anecdotes'

const getAll = async () => {
  const response = await axios.get(baseUrl)
  return response.data
}

const postNew = async (content) => {
  const newAnecdote = await axios.post(baseUrl,
    {
      content,
      votes: 0,
    }
  )
  return newAnecdote.data
}

const update = async (anecdote) => {
  const updated = await axios.patch(`${baseUrl}/${anecdote.id}`,
    anecdote
  )
  return updated.data
}

export default { getAll, postNew, update, }