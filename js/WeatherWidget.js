import UIComponent from './UIComponent.js';

/**
 * Виджет "Погода"
 * Получает данные с OpenWeatherMap API
 */
export default class WeatherWidget extends UIComponent {
    constructor(config = {}) {
        super({ ...config, title: config.title || 'Погода' });
        this.city = config.city || 'Moscow';
        this.weatherData = null;
        this.isLoading = false;
        
        // Бесплатный API ключ OpenWeatherMap
        // Зарегистрируйте свой на https://home.openweathermap.org/users/sign_up
        this.apiKey = 'bd5e378503939ddaee76f12ad7a97608'; // Демо-ключ
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
        
        this.fetchWeather();
        
        return this.createWidgetWrapper(container);
    }

    async fetchWeather() {
        if (this.isLoading) return;
        
        this.isLoading = true;
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
            <div style="text-align: center;">
                <div style="font-size: 1.1rem; font-weight: 600;"><i class="fas fa-location-dot"></i> ${this.weatherData.name}</div>
                <div style="font-size: 2.5rem; font-weight: 700; margin: 10px 0;">${temp}°C</div>
                <div>${weatherIcon} ${description}</div>
                <div style="display: flex; justify-content: center; gap: 15px; margin-top: 15px; font-size: 0.75rem;">
                    <span>🌡️ Ощущается: ${feelsLike}°C</span>
                    <span>💧 Влажность: ${humidity}%</span>
                    <span>💨 Ветер: ${windSpeed} м/с</span>
                </div>
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
