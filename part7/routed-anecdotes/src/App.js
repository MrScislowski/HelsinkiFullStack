import { useState } from 'react'
import {
  BrowserRouter as Router,
} from 'react-router-dom'
import Menu from './Menu'
import NotificationContext from './NotificationContext'
import Notification from './Notification'
import Footer from './Footer'

const App = () => {
  const [anecdotes, setAnecdotes] = useState([
    {
      content: 'If it hurts, do it more often',
      author: 'Jez Humble',
      info: 'https://martinfowler.com/bliki/FrequencyReducesDifficulty.html',
      votes: 0,
      id: 1
    },
    {
      content: 'Premature optimization is the root of all evil',
      author: 'Donald Knuth',
      info: 'http://wiki.c2.com/?PrematureOptimization',
      votes: 0,
      id: 2
    }
  ])

  const [notification, setNotification] = useState('')

  const addNew = (anecdote) => {
    anecdote.id = Math.round(Math.random() * 10000)
    setAnecdotes(anecdotes.concat(anecdote))
  }

  const anecdoteById = (id) =>
    anecdotes.find(a => a.id === id)

  const vote = (id) => {
    const anecdote = anecdoteById(id)

    const voted = {
      ...anecdote,
      votes: anecdote.votes + 1
    }

    setAnecdotes(anecdotes.map(a => a.id === id ? voted : a))
  }

  return (
    <NotificationContext.Provider value={[notification, setNotification]}>
      <div>
        <Notification />
        <h1>Software anecdotes</h1>

        <Router>
          <Menu anecdotes={anecdotes} addNew={addNew} />
        </Router>

        <Footer />
      </div>
    </NotificationContext.Provider>
  )
}

export default App
