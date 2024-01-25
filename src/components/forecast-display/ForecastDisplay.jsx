import React from 'react';
import './forecast-display.scss';

const ForecastDisplay = ({ data }) => {
	const getWeatherIcon = iconCode => {
		return `https://openweathermap.org/img/wn/${iconCode}@2x.png`;
	};

	const dailyData = data.list.reduce((acc, value) => {
		const forecastDate = new Date(value.dt * 1000).toLocaleDateString();
		const currentDate = new Date().toLocaleDateString();

		if (forecastDate !== currentDate) {
			if (!acc[forecastDate]) {
				acc[forecastDate] = value;
			}
		}

		return acc;
	}, {});

	return (
		<div className='forecast-display'>
			<h2>5 Day Forecast</h2>
			<div className='container-list'>
				{Object.values(dailyData).map((forecast, index) => (
					<div key={index} className='forecast'>
						<p className={`descreption item-${index + 1}`}>
							<span>
								{new Date(forecast.dt * 1000).toLocaleDateString()}
								{<br />}
								{forecast.weather[0].description}
								<img
									src={getWeatherIcon(forecast.weather[0].icon)}
									alt={forecast.weather[0].description}
								/>
							</span>
						</p>
						<p className={`item-${index + 1}`}>
							Temperature {forecast.main.temp.toFixed(0)}°C
						</p>
					</div>
				))}
			</div>
		</div>
	);
};

export default ForecastDisplay;
