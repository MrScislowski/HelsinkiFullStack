import axios from 'axios'

const baseUrl = 'http://localhost:3001/anecdotes'

export const getAnecdotes = () => {
    return axios.get(baseUrl).then(res => res.data)
}

export const updateAnecdote = anecdote => {
    return axios.patch(`${baseUrl}/${anecdote.id}`, anecdote).then(res => res.data)
}

export const addAnecdote = anecdote => {
    return axios.post(baseUrl, anecdote).then(res => res.data)
}