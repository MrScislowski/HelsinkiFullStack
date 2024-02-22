const Statistics = (props) => {
  const { good, neutral, bad } = props;

  const total = good + neutral + bad;
  const avg = (good - bad) / total;
  const percentPos = (good / total) * 100;

  return (
    <>
      <h2>Statistics</h2>
      <p>good: {good}</p>
      <p>neutral: {neutral}</p>
      <p>bad: {bad}</p>
      <p>total votes: {total}</p>
      <p>average feedback score: {total === 0 ? "" : avg.toFixed(2)}</p>
      <p>
        percent positive feedback:{" "}
        {total === 0 ? "" : `${percentPos.toFixed(1)}%`}
      </p>
    </>
  );
};

export default Statistics;
