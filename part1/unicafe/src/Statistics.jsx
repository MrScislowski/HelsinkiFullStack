const StatisticsHeader = () => {
  return <h2>Statistics</h2>;
};

const StatisticLine = (props) => {
  const { text, value } = props;

  return (
    <tr>
      <td>{text}:</td>
      <td>{value}</td>
    </tr>
  );
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
      <table>
        <tbody>
          <StatisticLine text="good" value={good} />
          <StatisticLine text="neutral" value={neutral} />
          <StatisticLine text="bad" value={bad} />
          <StatisticLine text="total votes" value={total} />
          <StatisticLine text="average feedback score" value={avg.toFixed(2)} />
          <StatisticLine
            text="percent positive feedback"
            value={`${percentPos.toFixed(1)}%`}
          />
        </tbody>
      </table>
    </>
  );
};

export default Statistics;
