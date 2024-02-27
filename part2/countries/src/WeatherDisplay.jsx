const WeatherDisplay = (props) => {
  const { weather, cityName } = props;
  if (!weather) {
    return null;
  }

  return (
    <>
      <h2>Weather for {cityName}</h2>
      <p>Temperature: {weather.temperature.toFixed(1)} C</p>
      <img src={weather.iconUrl} />
      <p>Wind: {weather.wind.toFixed(1)} m/s</p>
    </>
  );
};

export default WeatherDisplay;
