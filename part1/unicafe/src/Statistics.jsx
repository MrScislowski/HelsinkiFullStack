const Statistics = (props) => {
  const { good, neutral, bad } = props;

  return (
    <>
      <h2>Statistics</h2>
      <p>good: {good}</p>
      <p>neutral: {neutral}</p>
      <p>bad: {bad}</p>
    </>
  );
};

export default Statistics;
