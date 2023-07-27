// ┬ ┬┌─┐┌─┐┌┬┐┬ ┬┌─┐┬─┐
// │││├┤ ├─┤ │ ├─┤├┤ ├┬┘
// └┴┘└─┘┴ ┴ ┴ ┴ ┴└─┘┴└─
// Functions to setup Weather widget.

const iconElement = document.querySelector('.weatherIcon');
const tempElement = document.querySelector('.weatherValue p');
const descElement = document.querySelector('.weatherDescription p');

const weather = {};
weather.temperature = {
	unit: 'celsius',
};

function decodeWeather(code, isDay) {
	const dayChar = isDay == 1 ? "d" : "n";
	if (code == 0) {
		return ["clear sky", "01".concat(dayChar)];
	} else if (code == 1) {
		return ["few clouds", "02".concat(dayChar)];
	} else if (code == 2) {
		return ["partly cloudy", "03".concat(dayChar)];
	} else if (code == 3) {
		return ["cloudy", "04".concat(dayChar)];
	} else if (code == 45 || code == 48) {
		return ["fog", "50".concat(dayChar)];
	} else if (code >= 50 && code < 60) {
		return ["light rain", "09".concat(dayChar)];
	} else if (code >= 60 && code < 70) {
		return ["rain", "10".concat(dayChar)];
	} else if (code >= 80 && code <= 82) {
		return ["rain showers", "10".concat(dayChar)];
	} else if (code >= 70 && code < 80) {
		return ["snow", "13".concat(dayChar)];
	} else if (code >= 85 && code <= 86) {
		return ["snow showers", "13".concat(dayChar)];
	} else if (code >= 95 && code < 100) {
		return ["thunderstorms", "11".concat(dayChar)];
	} else {
		return ["none", "unknown"];
	}
}

var tempUnit = CONFIG.weatherUnit;

const KELVIN = 273.15;
// const key = `${CONFIG.weatherKey}`;
setPosition();

function setPosition(position) {
	if (!CONFIG.trackLocation || !navigator.geolocation) {
		if (CONFIG.trackLocation) {
			console.error('Geolocation not available');
		}
		getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		return;
	}
	navigator.geolocation.getCurrentPosition(
		pos => {
			getWeather(pos.coords.latitude.toFixed(3), pos.coords.longitude.toFixed(3));
		},
		err => {
			console.error(err);
			getWeather(CONFIG.defaultLatitude, CONFIG.defaultLongitude);
		}
	);
}

function getWeather(latitude, longitude) {
	// let api = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&lang=${CONFIG.language}&appid=${key}`;
	let api = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`;
	fetch(api)
		.then(function(response) {
			let data = response.json();
			return data;
		})
		.then(function(data) {
			let celsius = Math.floor(data.current_weather.temperature - KELVIN);
			let apiWeather = decodeWeather(data.current_weather.weathercode, data.current_weather.is_day);
			weather.temperature.value = tempUnit == 'C' ? celsius : (celsius * 9) / 5 + 32;
			weather.description = apiWeather[0];
			weather.iconId = apiWeather[1];
		})
		.then(function() {
			displayWeather();
		});
}

function displayWeather() {
	iconElement.innerHTML = `<img src="assets/icons/${CONFIG.weatherIcons}/${weather.iconId}.png"/>`;
	tempElement.innerHTML = `${weather.temperature.value.toFixed(0)}°<span class="darkfg">${tempUnit}</span>`;
	descElement.innerHTML = weather.description;
}
