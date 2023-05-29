import { useDispatch } from "react-redux";
import { castVote } from "../reducers/anecdoteReducer";

const AnecdoteList = (props) => {
    const anecdotes = props.anecdotes;
    const dispatch = useDispatch()


    return (
        <>
            <h2>Anecdotes</h2>
            {anecdotes.map(anecdote =>
                <div key={anecdote.id}>
                    <div>
                        {anecdote.content}
                    </div>
                    <div>
                        has {anecdote.votes}
                        <button onClick={() => dispatch(castVote(anecdote.id))}>vote</button>
                    </div>
                </div>
            )}
        </>
    )
}

export default AnecdoteList