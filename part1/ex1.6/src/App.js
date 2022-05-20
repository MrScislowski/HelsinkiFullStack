import {useState} from 'react'

// https://fullstackopen.com/en/part1/a_more_complex_state_debugging_react_apps#exercises-1-6-1-14

const incrementVariable = (curVal, setFun) => {
  setFun(curVal + 1)
}



const calculateMoreStats = (g, n, b) => {
  let retVal = {}
  retVal.totalCount = g + n + b
  retVal.averageScore = (g*1 + b*-1) / retVal.totalCount
  retVal.percentPositive = g / retVal.totalCount * 100
  return retVal
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

const RenderStatistics = ({good, neutral, bad}) => {
  
  const {totalCount, averageScore, percentPositive} = calculateMoreStats(good, neutral, bad)
  if (totalCount > 0) {
    return (
      <>
      <h1>statistics</h1>
      <p> good: {good} </p>
      <p> neutral: {neutral} </p>
      <p> bad: {bad}</p>
      <p> all: {totalCount}</p>
      <p> average: {averageScore}</p>
      <p> positive: {percentPositive}%</p>
      </>
    )
  } else {
    return (
      <>
      <h1>statistics</h1>
      <p> no feedback given</p>
      </>
    )
  }
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
