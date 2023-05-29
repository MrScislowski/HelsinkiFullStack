import { useDispatch } from "react-redux"
import { updateFilter } from "../reducers/filterReducer"

const Filter = (props) => {
  const filter = props.filter
  const dispatch = useDispatch()

  return (
    <>
      <h2> Filter Options </h2>
      Filter by text: 
      <input type="text" value={filter} onChange={event => dispatch(updateFilter(event.target.value))}/>
    </>
  )
}

export default Filter