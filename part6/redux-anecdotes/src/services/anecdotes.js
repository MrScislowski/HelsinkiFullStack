import axios from "axios"

const baseUrl = "http://localhost:3001/anecdotes"

const getAnecdotesFromDb = async () => {
    const serverResponse = await axios.get(baseUrl)
    return serverResponse.data
}

const addAnecdoteToDb = async (anecdote) => {
    await axios.post(baseUrl, anecdote)
}

export default { getAnecdotesFromDb, addAnecdoteToDb }