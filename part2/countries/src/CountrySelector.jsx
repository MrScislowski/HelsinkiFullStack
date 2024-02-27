const CountrySelector = (props) => {
  const { countryData, setCountrySearch } = props;

  const chooseCountry = () => {
    setCountrySearch(countryData.name);
  };

  return (
    <li>
      {countryData.name} <button onClick={chooseCountry}>show</button>{" "}
    </li>
  );
};

export default CountrySelector;
