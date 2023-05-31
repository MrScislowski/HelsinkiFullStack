import { useDispatch } from "react-redux";
import { castVote } from "../reducers/anecdoteReducer";

const AnecdoteList = (props) => {
    const anecdotes = props.anecdotes
    const sortedAnecdotes = [...anecdotes].sort((a1, a2) => a1.votes - a2.votes)

    const dispatch = useDispatch()

    return (
        <>
            <h2>Anecdotes</h2>
            {sortedAnecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => {
                            dispatch(castVote(anecdote.id))
                            }}>vote</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AnecdoteList