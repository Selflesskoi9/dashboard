import Dashboard from './js/Dashboard.js';
import ToDoWidget from './js/ToDoWidget.js';
import QuoteWidget from './js/QuoteWidget.js';
import WeatherWidget from './js/WeatherWidget.js';

/**
 * Главный файл приложения
 * Инициализирует дашборд и настраивает обработчики кнопок
 */

// Ждём полной загрузки DOM
document.addEventListener('DOMContentLoaded', () => {
    // Создаем экземпляр дашборда
    const dashboard = new Dashboard('dashboardGrid');
    
    // Получаем кнопки
    const addTodoBtn = document.getElementById('addTodoBtn');
    const addQuoteBtn = document.getElementById('addQuoteBtn');
    const addWeatherBtn = document.getElementById('addWeatherBtn');
    const clearAllBtn = document.getElementById('clearAllBtn');
    
    // Добавляем обработчики событий
    if (addTodoBtn) {
        addTodoBtn.addEventListener('click', () => {
            dashboard.addWidget('todo');
        });
    }
    
    if (addQuoteBtn) {
        addQuoteBtn.addEventListener('click', () => {
            dashboard.addWidget('quote');
        });
    }
    
    if (addWeatherBtn) {
        addWeatherBtn.addEventListener('click', () => {
            dashboard.addWidget('weather');
        });
    }
    
    if (clearAllBtn) {
        clearAllBtn.addEventListener('click', () => {
            if (confirm('Вы уверены, что хотите удалить все виджеты?')) {
                dashboard.removeAllWidgets();
            }
        });
    }
    
    // Добавляем тестовый виджет при загрузке (для демонстрации)
    // dashboard.addWidget('todo');
    
    console.log('Дашборд инициализирован успешно!');
});