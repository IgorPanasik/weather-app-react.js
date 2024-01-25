import React, { useEffect, useState } from 'react';
import SearchButton from './buttons/SearchButton';
import ForecastDisplay from './forecast-display/ForecastDisplay';
import './weather-app.scss';
import WeatherDisplay from './weather-display/WeatherDisplay';
import { weatherImages } from '../weather-images-js/weatherImages';

const WeatherApp = () => {
	const [city, setCity] = useState('Minsk');
	const [weatherData, setWeatherData] = useState(null);
	const [forecastData, setForecastData] = useState(null);
	const [showForecast, setShowForecast] = useState(false);
	const [currentTime, setCurrentTime] = useState(new Date());
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState('');

	const apiKey = 'bd5a7f4eb553f2be91e6ac1fed4dbd77';

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition(
				position => {
					const { latitude, longitude } = position.coords;
					fetchWeatherByCoordinates(latitude, longitude);
					fetchForecastByCoordinates(latitude, longitude);
				},
				error => {
					console.error('Geolocation error:', error.message);
					// Handle geolocation error
					setErrorMessage(
						'Geolocation error: Please allow access to your location or enter a city manually.'
					);
					// If geolocation fails, fetch weather for the default city 'Minsk'
					fetchWeather();
					fetchForecast();
				}
			);
		} else {
			console.error('Geolocation is not supported by your browser');
			// Handle geolocation not supported
			setErrorMessage(
				'Geolocation is not supported by your browser. Please enter a city manually.'
			);
			// If geolocation is not supported, fetch weather for the default city 'Minsk'
			fetchWeather();
			fetchForecast();
		}
	}, []);

	useEffect(() => {
		const timer = setInterval(() => {
			setCurrentTime(new Date());
		}, 1000);

		return () => {
			clearInterval(timer);
		};
	}, []);

	const fetchWeatherByCoordinates = async (latitude, longitude) => {
		setIsLoading(true);
		setErrorMessage('');
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
			);

			if (!response.ok) {
				throw new Error('Weather data not found');
			}

			const data = await response.json();
			setWeatherData(data);
			setCity(data.name); // Set the city based on geolocation
			fetchForecastByCoordinates(latitude, longitude);
		} catch (error) {
			console.error(error.message);
			setErrorMessage(
				error.message === 'Weather data not found'
					? 'Weather data not found!'
					: 'An error occurred while retrieving the weather'
			);
		}
		setIsLoading(false);
		setTimeout(() => {
			setErrorMessage('');
		}, 3000);
	};

	const fetchForecastByCoordinates = async (latitude, longitude) => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}&units=metric`
			);

			if (!response.ok) {
				throw new Error('Forecast data not found');
			}

			const data = await response.json();
			setForecastData(data);
		} catch (error) {
			console.error(error.message);
		}

		setIsLoading(false);
	};

	const fetchWeather = async () => {
		setIsLoading(true);
		setErrorMessage('');
		if (!city) {
			setIsLoading(false);
			return;
		}
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
			);

			if (!response.ok) {
				throw new Error('City not found');
			}

			const data = await response.json();
			setWeatherData(data);
			fetchForecast();
		} catch (error) {
			console.error(error.message);
			setErrorMessage(
				error.message === 'City not found'
					? 'City not found!'
					: 'An error occurred while retrieving the weather'
			);
		}
		setIsLoading(false);
		setTimeout(() => {
			setErrorMessage('');
		}, 3000);
	};

	const fetchForecast = async () => {
		setIsLoading(true);
		try {
			const response = await fetch(
				`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`
			);

			if (!response.ok) {
				throw new Error('City not found');
			}

			const data = await response.json();
			setForecastData(data);
		} catch (error) {
			console.error(error.message);
		}

		setIsLoading(false);
	};

	const handleKeyPress = event => {
		if (event.key === 'Enter') {
			fetchWeather();
		}
	};

	if (isLoading) {
		return (
			<div className='loader'>
				<div className='inner one'></div>
				<div className='inner two'></div>
				<div className='inner three'></div>
			</div>
		);
	}

	function isNightTime(currentTime) {
		const hours = currentTime.getHours();
		return hours >= 18 || hours < 6;
	}

	const isNight = isNightTime(currentTime);

	function getWeatherImage(description, isNight) {
		let weatherImage;

		if (description) {
			let key = description;

			if (isNight && (description === 'clear sky' || description === 'mist')) {
				key += ' night';
			}

			if (description.toLowerCase().includes('snow')) {
				key = 'snow';
			}

			if (description.toLowerCase().includes('rain')) {
				key = 'rain';
			}

			weatherImage = weatherImages[key];

			if (!weatherImage && description.includes('clouds')) {
				weatherImage = weatherImages['clouds'];
			}
		}

		if (!weatherImage) {
			weatherImage =
				'./assets/icon-weather/thermometer-temperature-svgrepo-com.svg';
		}
		return weatherImage;
	}

	return (
		<div className='weather-app'>
			<div className='wrapper'>
				<div></div>
				<div className='current-date'>
					<p className='current-time'>
						{currentTime.toLocaleTimeString([], {
							hour: '2-digit',
							minute: '2-digit',
						})}
					</p>
					<p className='current-week-day'>
						{currentTime.toLocaleDateString('en-En', {
							weekday: 'long',
						})}
					</p>

					<p className='current-week-day'>
						{currentTime.toLocaleDateString('ru-En', {
							day: '2-digit',
							month: '2-digit',
							year: 'numeric',
						})}
					</p>
				</div>
			</div>

			<h1>
				Weather <img src='./assets/internet-svgrepo-com.svg' alt='world' />
			</h1>

			<div className='container-row'>
				<div className='container-svg'>
					{weatherData && (
						<img
							src={getWeatherImage(weatherData.weather[0].description, isNight)}
							alt='weather'
						/>
					)}
				</div>
				<form action='#'>
					<div className='input-button'>
						<input
							title='Enter Please a City'
							type='text'
							placeholder='Enter Please a City (Venice, IT)'
							required
							value={city}
							onChange={e => setCity(e.target.value.trim())}
							onKeyPress={handleKeyPress}
						/>
						<button
							title='Search a City'
							className='search-city'
							onClick={fetchWeather}
						>
							<SearchButton />
						</button>
					</div>
				</form>

				{errorMessage && <p className='error-message'>{errorMessage}</p>}
				<button
					title='5 Days Forecast'
					className='weather-five-days'
					onClick={() => {
						if (!showForecast) {
							fetchForecast();
						}
						setShowForecast(!showForecast);
					}}
				>
					5 Days Forecast
				</button>
			</div>
			{weatherData && (
				<WeatherDisplay data={weatherData} currentTime={currentTime} />
			)}
			{showForecast && forecastData && <ForecastDisplay data={forecastData} />}
		</div>
	);
};

export default WeatherApp;
