import axios from 'axios'

const baseUrl = `http://localhost:3001/persons`

const getAll = () => {
    const request = axios.get(baseUrl)
    return request.then(response => response.data)
}

const create = (entry) => {
    const request = axios.post(baseUrl, entry)
    return request.then(response => response.data)
}

const deleteEntry = (entry) => {
    const request = axios.delete(`${baseUrl}/${entry.id}`)
    return request.then(response => response.data)
}

const updateEntry = (oldVersion, newVersion) => {
    const request = axios.put(`${baseUrl}/${oldVersion.id}`, newVersion)
    return request.then(response => response.data)
}

export default {getAll, create, deleteEntry, updateEntry}