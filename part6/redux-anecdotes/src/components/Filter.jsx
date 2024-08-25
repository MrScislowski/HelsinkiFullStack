import { useDispatch, useSelector } from "react-redux"
import { setFilter } from "../reducers/filterReducer"

const Filter = () => {
  const filter = useSelector(state => state.filter)
  const dispatch = useDispatch()

  return (
    <>
      <label htmlFor='filter-input'> filter: </label>
      <input type='text' id='filter-input' value={filter} onChange={e => dispatch(setFilter(e.target.value))} />
    </>
  )

}

export default Filter