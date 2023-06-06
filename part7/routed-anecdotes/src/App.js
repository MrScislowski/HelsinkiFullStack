import { useState } from 'react'
import {
  BrowserRouter as Router,
  Link
} from 'react-router-dom'
import Menu from './Menu'
import NotificationContext from './NotificationContext'
import Notification from './Notification'


export const AnecdoteList = ({ anecdotes }) => (
  <div>
    <h2>Anecdotes</h2>
    <ul>
      {anecdotes.map(anecdote => (
        <Link key={anecdote.id} to={`/anecdotes/${anecdote.id}`}>
          <li >{anecdote.content}</li>
        </Link>))}
    </ul>
  </div>
)

export const Anecdote = ({ anecdote }) => {
  return (
    <div>
      <blockquote> {anecdote.content} </blockquote>
      <cite> -{anecdote.author} (<a href={anecdote.info}> {anecdote.info} </a>)</cite>
    </div>
  )
}

export const About = () => (
  <div>
    <h2>About anecdote app</h2>
    <p>According to Wikipedia:</p>

    <em>An anecdote is a brief, revealing account of an individual person or an incident.
      Occasionally humorous, anecdotes differ from jokes because their primary purpose is not simply to provoke laughter but to reveal a truth more general than the brief tale itself,
      such as to characterize a person by delineating a specific quirk or trait, to communicate an abstract idea about a person, place, or thing through the concrete details of a short narrative.
      An anecdote is "a story with a point."</em>

    <p>Software engineering is full of excellent anecdotes, at this app you can find the best and add more.</p>
  </div>
)

export const Footer = () => (
  <div>
    Anecdote app for <a href='https://fullstackopen.com/'>Full Stack Open</a>.

    See <a href='https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js'>https://github.com/fullstack-hy2020/routed-anecdotes/blob/master/src/App.js</a> for the source code.
  </div>
)

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
          <Menu anecdotes={anecdotes} addNew={addNew} notification={notification} setNotification={setNotification} />
        </Router>


        <Footer />
      </div>
    </NotificationContext.Provider>
  )
}

export default App
