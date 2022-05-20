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

const Button = ({count, setter, text}) => {
  return ( 
    <>
    <button onClick={() => incrementVariable(count, setter)}>{text}</button>
    </>
  )
}

const RenderFeedback = ({goodCount, setGoodCount, neutralCount, setNeutralCount, badCount, setBadCount}) => {
  return (
    <>
    <h1>give feedback</h1>
    <Button count={goodCount} setter={setGoodCount} text="good" />
    <Button count={neutralCount} setter={setNeutralCount} text="neutral" />
    <Button count={badCount} setter={setBadCount} text="bad" />
    </>
  )
}

const StatisticLine = ({text, value}) => {
  return (
    <>
    <tr>
     <td>{text}</td><td>{value}</td>
    </tr>
    </>
  )
}

const RenderStatistics = ({good, neutral, bad}) => {
  
  const {totalCount, averageScore, percentPositive} = calculateMoreStats(good, neutral, bad)
  if (totalCount > 0) {
    return (
      <>
      <h1>statistics</h1>

      <table> <tbody>
      <StatisticLine text="good" value={good} />
      <StatisticLine text="neutral" value={neutral} />
      <StatisticLine text="bad" value={bad} />
      <StatisticLine text="all" value={totalCount} />
      <StatisticLine text="average" value={averageScore} />
      <StatisticLine text="positive" value={percentPositive + "%"} />
      </tbody>
      </table>
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
