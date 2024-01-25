import React from 'react';
import './weather-display.scss';

const WeatherDisplay = ({ data, currentTime }) => {
	const flagUrl = `https://flagsapi.com/${data.sys.country}/shiny/64.png`;

	const getWeatherIcon = iconCode => {
		return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
	};

	return (
		<div className='container-data'>
			<h2>
				{data.name} <img src={flagUrl} alt={`${data.sys.country} flag`} />
			</h2>
			<div className='data-row'>
				<p>
					Temperature <span>{data.main.temp.toFixed(0)}°C</span>
				</p>
				<p>
					Weather
					<br />
					<span style={{ textTransform: 'capitalize' }}>
						{data.weather[0].description}
						<img
							src={getWeatherIcon(data.weather[0].icon)}
							alt={data.weather[0].description}
						/>
					</span>
				</p>
				<p>
					Humidity <span>{data.main.humidity}%</span>
				</p>
				<p>
					Wind <br />
					<span>{(data.wind.speed * 3.6).toFixed(1)} km/h</span>
				</p>
				<p>
					Feels Like <span>{data.main.feels_like.toFixed(0)}°C</span>
				</p>
				<p>
					Visibility <br />
					<span>{(data.visibility / 1000).toFixed(1)} km</span>
				</p>
				<p>
					Pressure <br />
					<span>{data.main.pressure} mbar</span>
				</p>
				<p>
					Temperature Max <br /> <span>{Math.round(data.main.temp_max)} ℃</span>
				</p>
			</div>
		</div>
	);
};

export default WeatherDisplay;
