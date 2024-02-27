const CountryDisplay = (props) => {
  const { countryData } = props;
  const { name, capital, area, languages, flagUrl } = countryData;

  return (
    <>
      <h2>{name}</h2>
      <p>capital: {capital}</p>
      <p>area: {area}</p>

      <h3>languages:</h3>
      <ul>
        {languages.map((l) => (
          <li key={l}>{l}</li>
        ))}
      </ul>

      <img src={flagUrl} />
    </>
  );
};

export default CountryDisplay;
