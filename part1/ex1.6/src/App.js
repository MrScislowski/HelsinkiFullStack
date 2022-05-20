import {useState} from 'react'

// https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps#exercises-1-6-1-14

const RenderFeedback = () => {

}

const RenderStatistics = (props) => {
  return (
    <>
    <h1>statistics</h1>
    <p> good {props.good} </p>
    <p> neutral {props.neutral} </p>
    <p> bad {props.bad}</p>
    </>
  )
}

const App = () => {
  const [goodCount, setGoodCount] = useState(0)
  const [neutralCount, setNeutralCount] = useState(0)
  const [badCount, setBadCount] = useState(0)

  return (
    <div>
      <RenderStatistics good={goodCount} neutral={neutralCount} bad={badCount} />
    </div>
  )
}

export default App;
