import { useEffect, useState } from "react";
import axios from "axios";
import WeatherDisplay from "./WeatherDisplay";

const CountryDisplay = (props) => {
  const { countryData } = props;
  const { name, capital, area, languages, flagUrl, id } = countryData;

  const [weather, setWeather] = useState(null);

  useEffect(() => {
    const api_key = import.meta.env.VITE_OPENWEATHER_APIKEY;

    axios
      .get(
        `http://api.openweathermap.org/geo/1.0/direct?q=${capital},${id}&limit=1&appid=${api_key}`
      )
      .then((response) => {
        const { lat, lon } = response.data[0];
        return axios.get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${api_key}`
        );
      })
      .then((response) => {
        const temperature = response.data.main.temp - 273.15;
        const wind = response.data.wind.speed;
        const iconCode = response.data.weather[0].icon;

        const iconUrl = `https://openweathermap.org/img/wn/${iconCode}@2x.png`;

        setWeather({
          temperature,
          wind,
          iconUrl,
        });
      });
  }, []);

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

      <WeatherDisplay weather={weather} cityName={capital} />
    </>
  );
};

export default CountryDisplay;
