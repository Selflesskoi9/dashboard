import ToDoWidget from './ToDoWidget.js';
import QuoteWidget from './QuoteWidget.js';
import WeatherWidget from './WeatherWidget.js';

/**
 * Класс Dashboard (Панель управления)
 * Управляет коллекцией виджетов и их отображением на странице
 */
export default class Dashboard {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        this.widgets = [];
        this.emptyState = document.getElementById('emptyState');
        
        if (!this.container) {
            console.error('Контейнер для дашборда не найден');
        }
    }

    /**
     * Добавляет новый виджет на панель
     * @param {string} widgetType - Тип виджета ('todo', 'quote', 'weather')
     */
    addWidget(widgetType) {
        let widget;
        
        switch (widgetType.toLowerCase()) {
            case 'todo':
                widget = new ToDoWidget();
                break;
            case 'quote':
                widget = new QuoteWidget();
                break;
            case 'weather':
                widget = new WeatherWidget();
                break;
            default:
                console.error(`Неизвестный тип виджета: ${widgetType}`);
                return;
        }
        
        // Добавляем метод onDestroy для удаления из коллекции
        widget.onDestroy = (widgetId) => {
            this.removeWidget(widgetId);
        };
        
        const widgetElement = widget.render();
        this.container.appendChild(widgetElement);
        this.widgets.push(widget);
        
        // Скрываем сообщение о пустой панели, если оно отображается
        this.toggleEmptyState();
        
        return widget;
    }

    /**
     * Удаляет виджет по ID
     * @param {string} widgetId - ID виджета для удаления
     */
    removeWidget(widgetId) {
        const index = this.widgets.findIndex(w => w.id === widgetId);
        if (index !== -1) {
            // Удаляем виджет
            this.widgets[index].destroy();
            this.widgets.splice(index, 1);
        }
        this.toggleEmptyState();
    }

    /**
     * Удаляет все виджеты с панели
     */
    removeAllWidgets() {
        this.widgets.forEach(widget => {
            widget.destroy();
        });
        this.widgets = [];
        this.toggleEmptyState();
    }

    /**
     * Показывает/скрывает сообщение о пустой панели
     */
    toggleEmptyState() {
        if (this.emptyState) {
            if (this.widgets.length === 0) {
                this.emptyState.classList.remove('hidden');
            } else {
                this.emptyState.classList.add('hidden');
            }
        }
    }

    /**
     * Возвращает массив всех виджетов
     */
    getWidgets() {
        return [...this.widgets];
    }

    /**
     * Возвращает количество виджетов
     */
    getWidgetCount() {
        return this.widgets.length;
    }
}