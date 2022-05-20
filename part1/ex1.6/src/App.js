import {useState} from 'react'

// https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps#exercises-1-6-1-14

const incrementVariable = (curVal, setFun) => {
  setFun(curVal + 1)
}

const RenderFeedback = (props) => {
  return (
    <>
    <h1>give feedback</h1>
    <button onClick={() => incrementVariable(props.goodCount, props.setGoodCount)}>good</button>
    <button onClick={() => incrementVariable(props.neutralCount, props.setNeutralCount)}>neutral</button>
    <button onClick={() => incrementVariable(props.badCount, props.setBadCount)}>bad</button>
    </>
  )
}

const RenderStatistics = (props) => {
  return (
    <>
    <h1>statistics</h1>
    <p> good: {props.good} </p>
    <p> neutral: {props.neutral} </p>
    <p> bad: {props.bad}</p>
    </>
  )
}

const App = () => {
  const [goodCount, setGoodCount] = useState(0)
  const [neutralCount, setNeutralCount] = useState(0)
  const [badCount, setBadCount] = useState(0)

  return (
    <div>
      <RenderFeedback goodCount={goodCount} setGoodCount={setGoodCount}
       neutralCount={neutralCount} setNeutralCount={setNeutralCount}
       badCount={badCount} setBadCount={setBadCount}/>
      <RenderStatistics good={goodCount} neutral={neutralCount} bad={badCount} />
    </div>
  )
}

export default App;
