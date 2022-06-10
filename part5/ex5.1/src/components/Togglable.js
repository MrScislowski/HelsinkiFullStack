import {useState} from 'react'

const Togglable = (props) => {

  const [visible, setVisible] = useState(props.startingVisibility)

  const visibleStyle = {display: (visible)? '' : 'none'}
  const buttonLabel = (visible)? 'hide' : 'show'


  return (
    <>
      <button onClick={() => setVisible(!visible)}>{buttonLabel}</button>
      <div style={visibleStyle}>
        {props.children}
      </div>
    </>
  )

}


export default Togglable