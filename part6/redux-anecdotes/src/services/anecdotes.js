import axios from "axios"

const baseUrl = "http://localhost:3001/anecdotes"

const getAnecdotesFromDb = async () => {
    const serverResponse = await axios.get(baseUrl)
    return serverResponse.data
}

const addAnecdoteToDb = async (anecdote) => {
    const serverResponse = await axios.post(baseUrl, anecdote)
    return serverResponse.data
}

const updateAnecdote = async (modifiedAnecdote) => {
    const serverResponse = await axios.patch(`${baseUrl}/${modifiedAnecdote.id}`, modifiedAnecdote)
    return serverResponse.data
}

export default { getAnecdotesFromDb, addAnecdoteToDb, updateAnecdote }