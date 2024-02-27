import { useEffect, useState } from "react";
import axios from "axios";
import SearchResults from "./SearchResults";

function App() {
  const [countrySearch, setCountrySearch] = useState("");
  const [countryDataList, setCountryDataList] = useState([]);

  const filteredCountries = countryDataList.filter((c) =>
    c.name.toLowerCase().includes(countrySearch.toLowerCase())
  );

  useEffect(() => {
    axios
      .get("https://studies.cs.helsinki.fi/restcountries/api/all")
      .then((response) => {
        const prunedData = response.data.map((countryData) => {
          return {
            name: countryData["name"]["common"],
            id: countryData["cca3"],
            capital: countryData["capital"],
            area: countryData["area"],
            languages: !countryData["languages"]
              ? []
              : Object.keys(countryData["languages"]).map(
                  (key) => countryData["languages"][key]
                ),
            flagUrl: countryData["flags"]["png"],
          };
        });
        setCountryDataList(prunedData);
      });
  }, []);

  return (
    <>
      <p>
        Search for a country:
        <input
          value={countrySearch}
          onChange={(e) => setCountrySearch(e.target.value)}
        />
      </p>

      <SearchResults
        filteredCountries={filteredCountries}
        countrySearch={countrySearch}
        setCountrySearch={setCountrySearch}
      />
    </>
  );
}

export default App;
