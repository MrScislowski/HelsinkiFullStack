import {useState, forwardRef, useImperativeHandle} from 'react'

const Togglable = forwardRef((props, refs) => {

  const [visible, setVisible] = useState(props.startingVisibility)

  const visibleStyle = {display: (visible)? '' : 'none'}
  const invisibleStyle = {display: (!visible)? '': 'none'}
  const buttonLabel = (visible)? 'hide' : props.buttonLabel

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  useImperativeHandle(refs, () => {
    return {
      toggleVisibility
    }
  })

  return (
    <>
      <button style = {invisibleStyle} onClick={toggleVisibility}>{buttonLabel}</button>
      <div style={visibleStyle}>
        {props.children}
      </div>
    </>
  )

})


export default Togglable