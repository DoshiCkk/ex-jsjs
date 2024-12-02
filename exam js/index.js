const apiKey = '034971579ebed0c9568e97edbc3ca6c2';
let city = 'Tashkent'; 
const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;

function changeTab(tabId) {
    const todayTab = document.getElementById('today-tab');
    const forecastTab = document.getElementById('forecast-tab');
    const todayContent = document.getElementById('today-content');
    const forecastContent = document.getElementById('forecast-content');

    if (tabId === 'today') {
        todayTab.classList.add('active');
        forecastTab.classList.remove('active');
        todayContent.style.display = 'block';
        forecastContent.style.display = 'none';
    } else {
        todayTab.classList.remove('active');
        forecastTab.classList.add('active');
        todayContent.style.display = 'none';
        forecastContent.style.display = 'block';
    }
}

async function getWeatherData(city) {
    const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
    const response = await fetch(cityUrl);
    if (!response.ok) {
        alert('Город не найден!');
        return;
    }
    const data = await response.json();
    displayCurrentWeather(data);
    displayCityTemps(data.coord);
}

function displayCurrentWeather(data) {
    const currentWeather = document.getElementById('current-weather');
    const date = new Date();
    const dateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
    document.getElementById('date').textContent = dateString;
    document.getElementById('temp').textContent = `Температура: ${data.main.temp}°C`;
    document.getElementById('feels-like').textContent = `Ощущается как: ${data.main.feels_like}°C`;

    const sunrise = new Date(data.sys.sunrise * 1000).toLocaleTimeString();
    const sunset = new Date(data.sys.sunset * 1000).toLocaleTimeString();
    const dayLength = Math.round((data.sys.sunset - data.sys.sunrise) / 60);
    document.getElementById('sunrise-sunset').textContent = `Восход: ${sunrise}, Закат: ${sunset}`;
    document.getElementById('day-duration').textContent = `Длительность дня: ${dayLength} минут`;

    const detailedInfo = document.getElementById('additional-info');
    detailedInfo.innerHTML = `
    Ветер: ${data.wind.speed} м/с<br>
    Давление: ${data.main.pressure} гПа<br>
    Влажность: ${data.main.humidity}%<br>
    `;
}

async function displayCityTemps(coord) {
    const cities = ['Moscow', 'New York', 'London'];
    cities.forEach(async (city, index) => {
        const cityUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}`;
        const response = await fetch(cityUrl);
        const data = await response.json();
        document.getElementById(`temp-city-${index + 1}`).textContent = `${data.main.temp}°C`;
    });
}

async function getFiveDayForecast(city) {
    const cityUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}`;
    const response = await fetch(cityUrl);
    const data = await response.json();
    displayFiveDayForecast(data);
}

document.getElementById('today-tab').addEventListener('click', function () {
    changeTab('today');
});

document.getElementById('forecast-tab').addEventListener('click', function () {
    changeTab('forecast');
});

document.getElementById('search-button').addEventListener('click', function () {
    const newCity = document.getElementById('city-input').value;
    if (newCity) {
        city = newCity;
        getWeatherData(city);
    }
});

window.addEventListener('DOMContentLoaded', function () {
    getWeatherData(city);
    changeTab('today'); 
});

async function getFiveDayForecast(city) {
    const cityUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(cityUrl);
    if (!response.ok) {
        alert('Ошибка при получении прогноза!');
        return;
    }
    const data = await response.json();
    displayFiveDayForecast(data);
}

function displayFiveDayForecast(data) {
    const forecastList = document.getElementById('forecast-list');
    forecastList.innerHTML = '';

    const days = data.list.filter((entry) => entry.dt_txt.includes('12:00:00'));

    days.forEach((day) => {
        const date = new Date(day.dt * 1000);
        const dateString = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}`;
        const temperature = `${Math.round(day.main.temp)}°C`;
        const weatherDescription = day.weather[0].description;
        const weatherIcon = `http://openweathermap.org/img/wn/${day.weather[0].icon}.png`;

        const forecastItem = document.createElement('div');
        forecastItem.classList.add('forecast-item');
        forecastItem.innerHTML = `
            <div class="forecast-date">${dateString}</div>
            <div class="forecast-temp">${temperature}</div>
            <div class="forecast-description">${weatherDescription}</div>
            <img src="${weatherIcon}" alt="${weatherDescription}" class="forecast-icon">
        `;
        forecastList.appendChild(forecastItem);
    });
}

document.getElementById('forecast-tab').addEventListener('click', function () {
    changeTab('forecast');
    getFiveDayForecast(city);
});

window.addEventListener('DOMContentLoaded', function () {
    getWeatherData(city);
    getFiveDayForecast(city);
    changeTab('today'); 
});