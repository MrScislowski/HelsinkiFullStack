const StatisticsHeader = () => {
  return <h2>Statistics</h2>;
};

const Statistics = (props) => {
  const { good, neutral, bad } = props;

  const total = good + neutral + bad;
  const avg = (good - bad) / total;
  const percentPos = (good / total) * 100;

  if (total === 0) {
    return (
      <>
        <StatisticsHeader />
        No feedback given
      </>
    );
  }

  return (
    <>
      <StatisticsHeader />
      <p>good: {good}</p>
      <p>neutral: {neutral}</p>
      <p>bad: {bad}</p>
      <p>total votes: {total}</p>
      <p>average feedback score: {avg.toFixed(2)}</p>
      <p>percent positive feedback: {`${percentPos.toFixed(1)}%`}</p>
    </>
  );
};

export default Statistics;
