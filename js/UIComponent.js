/**
 * Базовый абстрактный класс для всех UI-компонентов (виджетов)
 * Все виджеты должны наследоваться от этого класса
 */
export default class UIComponent {
    constructor(config = {}) {
        this.id = config.id || this.generateId();
        this.title = config.title || 'Виджет';
        this.element = null;
        this.isMinimized = false;
        this.eventListeners = [];
    }

    /**
     * Генерирует уникальный ID для виджета
     */
    generateId() {
        return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }

    /**
     * Создает DOM-элемент виджета
     * Должен быть переопределен в дочерних классах
     */
    render() {
        throw new Error('Метод render() должен быть переопределен в дочернем классе');
    }

    /**
     * Создает общую обёртку для виджета
     */
    createWidgetWrapper(contentElement) {
        const widget = document.createElement('div');
        widget.className = 'widget';
        widget.dataset.widgetId = this.id;
        
        const header = this.createHeader();
        const content = document.createElement('div');
        content.className = 'widget__content';
        content.appendChild(contentElement);
        
        widget.appendChild(header);
        widget.appendChild(content);
        
        this.element = widget;
        return widget;
    }

    /**
     * Создает заголовок виджета с кнопками управления
     */
    createHeader() {
        const header = document.createElement('div');
        header.className = 'widget__header';
        
        const title = document.createElement('div');
        title.className = 'widget__title';
        title.innerHTML = this.getTitleIcon();
        title.appendChild(document.createTextNode(this.title));
        
        const actions = document.createElement('div');
        actions.className = 'widget__actions';
        
        const closeBtn = document.createElement('button');
        closeBtn.className = 'widget__btn';
        closeBtn.innerHTML = '<i class="fas fa-times"></i>';
        closeBtn.title = 'Удалить виджет';
        closeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            this.destroy();
            if (this.onDestroy) this.onDestroy(this.id);
        });
        
        actions.appendChild(closeBtn);
        header.appendChild(title);
        header.appendChild(actions);
        
        return header;
    }

    /**
     * Возвращает иконку для виджета (может быть переопределено)
     */
    getTitleIcon() {
        return '<i class="fas fa-puzzle-piece"></i> ';
    }

    /**
     * Удаляет виджет из DOM и очищает все слушатели
     */
    destroy() {
        if (this.element && this.element.parentNode) {
            this.element.parentNode.removeChild(this.element);
        }
        this.eventListeners.forEach(({element, event, handler}) => {
            element.removeEventListener(event, handler);
        });
        this.eventListeners = [];
        this.element = null;
    }

    /**
     * Добавляет событие в список для последующей очистки
     */
    addEventListener(element, event, handler) {
        element.addEventListener(event, handler);
        this.eventListeners.push({element, event, handler});
    }
}