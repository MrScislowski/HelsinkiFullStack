import CountryDisplay from "./CountryDisplay";

const SearchResults = (props) => {
  const { filteredCountries, countrySearch } = props;

  if (filteredCountries.length > 10) {
    return <p>too many countries; refine search</p>;
  }

  if (filteredCountries.length == 1) {
    const theCountry = filteredCountries[0];
    return <CountryDisplay countryData={theCountry} />;
  }

  const exactCountryMatch = filteredCountries.find(
    (c) => c.name.toLowerCase() === countrySearch.toLowerCase()
  );

  if (exactCountryMatch) {
    return <CountryDisplay countryData={exactCountryMatch} />;
  }

  return (
    <ul>
      {filteredCountries.map((cdata) => (
        <li key={cdata.id}>{cdata.name}</li>
      ))}
    </ul>
  );
};

export default SearchResults;
