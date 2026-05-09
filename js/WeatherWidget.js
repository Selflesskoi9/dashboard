import UIComponent from './UIComponent.js';

/**
 * Виджет "Погода"
 * Получает данные с внешнего API (OpenWeatherMap)
 */
export default class WeatherWidget extends UIComponent {
    constructor(config = {}) {
        super({ ...config, title: config.title || 'Погода' });
        this.city = config.city || 'Moscow';
        this.weatherData = null;
        this.isLoading = false;
        
        // API ключ (для тестирования используем публичный, лучше зарегистрировать свой)
        this.apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // OpenWeatherMap demo key
    }

    getTitleIcon() {
        return '<i class="fas fa-cloud-sun"></i> ';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'weather__widget';
        
        // Форма для ввода города
        const cityInputGroup = document.createElement('div');
        cityInputGroup.className = 'weather__city';
        
        this.cityInput = document.createElement('input');
        this.cityInput.type = 'text';
        this.cityInput.placeholder = 'Введите название города...';
        this.cityInput.value = this.city;
        this.cityInput.className = 'weather__city-input';
        
        const setCityBtn = document.createElement('button');
        setCityBtn.className = 'weather__city-btn';
        setCityBtn.innerHTML = '<i class="fas fa-search"></i>';
        
        cityInputGroup.appendChild(this.cityInput);
        cityInputGroup.appendChild(setCityBtn);
        
        // Контейнер для информации о погоде
        this.weatherInfo = document.createElement('div');
        this.weatherInfo.className = 'weather__info';
        
        container.appendChild(cityInputGroup);
        container.appendChild(this.weatherInfo);
        
        this.addEventListener(setCityBtn, 'click', () => {
            this.city = this.cityInput.value.trim();
            if (this.city) this.fetchWeather();
        });
        
        this.addEventListener(this.cityInput, 'keypress', (e) => {
            if (e.key === 'Enter') {
                this.city = this.cityInput.value.trim();
                if (this.city) this.fetchWeather();
            }
        });
        
        // Загружаем погоду для города по умолчанию
        this.fetchWeather();
        
        return this.createWidgetWrapper(container);
    }

    async fetchWeather() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        // ИСПРАВЛЕНО: добавлена кавычка перед class=
        this.weatherInfo.innerHTML = '<div class="widget__loading"><i class="fas fa-spinner fa-pulse"></i><br>Загрузка погоды...</div>';
        
        try {
            const url = `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(this.city)}&appid=${this.apiKey}&units=metric&lang=ru`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error('Город не найден');
            }
            
            const data = await response.json();
            this.weatherData = data;
            this.renderWeather();
            
        } catch (error) {
            console.error('Ошибка получения погоды:', error);
            this.weatherInfo.innerHTML = `<div class="weather__error"><i class="fas fa-exclamation-triangle"></i><br>${error.message}</div>`;
        }
        
        this.isLoading = false;
    }

    renderWeather() {
        if (!this.weatherData) return;
        
        const temp = Math.round(this.weatherData.main.temp);
        const feelsLike = Math.round(this.weatherData.main.feels_like);
        const description = this.weatherData.weather[0].description;
        const humidity = this.weatherData.main.humidity;
        const windSpeed = Math.round(this.weatherData.wind.speed);
        
        const weatherIcon = this.getWeatherIcon(this.weatherData.weather[0].icon);
        
        this.weatherInfo.innerHTML = `
            <div class="weather__city-name"><i class="fas fa-location-dot"></i> ${this.weatherData.name}</div>
            <div class="weather__temp">${temp}°C</div>
            <div class="weather__condition">${weatherIcon} ${description}</div>
            <div class="weather__details">
                <span><i class="fas fa-temperature-low"></i> Ощущается: ${feelsLike}°C</span>
                <span><i class="fas fa-tint"></i> Влажность: ${humidity}%</span>
                <span><i class="fas fa-wind"></i> Ветер: ${windSpeed} м/с</span>
            </div>
        `;
    }

    getWeatherIcon(iconCode) {
        const icons = {
            '01d': '☀️', '01n': '🌙',
            '02d': '⛅', '02n': '☁️',
            '03d': '☁️', '03n': '☁️',
            '04d': '☁️', '04n': '☁️',
            '09d': '🌧️', '09n': '🌧️',
            '10d': '🌦️', '10n': '🌧️',
            '11d': '⛈️', '11n': '⛈️',
            '13d': '❄️', '13n': '❄️',
            '50d': '🌫️', '50n': '🌫️'
        };
        return icons[iconCode] || '🌡️';
    }
}
