import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import { voteForAnecdote, initializeAnecdotes } from "../reducers/anecdoteReducer"

const AnecdoteList = () => {
  const anecdotes = useSelector(({ filter, anecdotes }) => {
    let filteredAnecdotes
    // if there's no filter, show all the anecdotes
    if (filter.length === 0) {
      filteredAnecdotes = anecdotes
    } else {
      filteredAnecdotes = anecdotes.filter(anecdote => anecdote.content.includes(filter))
    }
    // sort anecdotes by votes, descending
    return [...filteredAnecdotes].sort((a1, a2) => a2.votes - a1.votes)
  })
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(initializeAnecdotes())
  }, [])

  const vote = (anecdote) => {
    dispatch(voteForAnecdote(anecdote.id))
  }

  return (
    <>
    {anecdotes.map(anecdote =>
      <div key={anecdote.id}>
        <div>
          {anecdote.content}
        </div>
        <div>
          has {anecdote.votes}
          <button onClick={() => vote(anecdote)}>vote</button>
        </div>
      </div>
    )}
    </>
  )
}

export default AnecdoteList