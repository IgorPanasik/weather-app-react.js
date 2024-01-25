import React, { useState, useEffect } from 'react';
import './reset.css';
import WeatherApp from './components/WeatherApp';
import './app.scss';

function App() {
	const [isLoading, setIsLoading] = useState(true);

	useEffect(() => {
		fetchData();
	}, []);

	const fetchData = async () => {
		setIsLoading(true);
		try {
			setIsLoading(false);
		} catch (error) {
			console.error(error);
			setIsLoading(false);
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

	return <WeatherApp />;
}

export default App;
