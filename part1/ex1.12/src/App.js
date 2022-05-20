import { useState } from 'react'

// https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps#exercises-1-6-1-14

const voteAndReturnNewArray = (voteArray, index) => {
  const retVal = [...voteArray]
  retVal[index]++
  return retVal
}

const getIdxOfMax = (arr) => {
  let maxIdx = 0
  for (let i = 0; i < arr.length; i++) {
    if (arr[i] > arr[maxIdx]) {
      maxIdx = i
    }
  }
  return maxIdx
}

const DisplayAnecdote = ({anecdotes, votes, selected}) => {
  return (
    <>
    <p>{anecdotes[selected]}</p>
    <p>has {votes[selected]} votes</p>
    </>
  )
}

const App = () => {
  const anecdotes = [
    'If it hurts, do it more often',
    'Adding manpower to a late software project makes it later!',
    'The first 90 percent of the code accounts for the first 10 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.',
    'Any fool can write code that a computer can understand. Good programmers write code that humans can understand.',
    'Premature optimization is the root of all evil.',
    'Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.',
    'Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when diagnosing patients'
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVoteArray] = useState(new Uint16Array(anecdotes.length))

  const mostPopularIdx = getIdxOfMax(votes)

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <DisplayAnecdote anecdotes={anecdotes} votes={votes} selected={selected} />
      <button onClick={() => setVoteArray(voteAndReturnNewArray(votes, selected))}> vote </button>
      <button onClick={() => setSelected(Math.floor(Math.random()*anecdotes.length))}>next anecdote</button>
      <h1>Anecdote with most votes:</h1>
      <DisplayAnecdote anecdotes={anecdotes} votes={votes} selected={mostPopularIdx} />
    </div>
  )
}

export default App;
