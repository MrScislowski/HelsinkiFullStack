import { useState } from 'react'

const Togglable = (props) => {
  const {visibility, buttonLabel, dispatch, action} = props;

  const buttonText = (visibility)? "hide" : buttonLabel;

  return (
    <>
    {visibility ? 
    props.children :
    <></>}
    <button onClick={() => dispatch(action())}>{buttonText}</button>
    </>
  )
}

export default Togglable;