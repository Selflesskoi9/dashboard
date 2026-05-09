import UIComponent from './UIComponent.js';

/**
 * Виджет "Случайная цитата"
 * Получает данные с внешнего API (Quotable API)
 */
export default class QuoteWidget extends UIComponent {
    constructor(config = {}) {
        super({ ...config, title: config.title || 'Цитата дня' });
        this.quote = { text: 'Загрузка...', author: '' };
        this.isLoading = false;
    }

    getTitleIcon() {
        return '<i class="fas fa-quote-right"></i> ';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'quote__widget';
        
        this.quoteText = document.createElement('div');
        this.quoteText.className = 'quote__text';
        
        this.quoteAuthor = document.createElement('div');
        this.quoteAuthor.className = 'quote__author';
        
        const refreshBtn = document.createElement('button');
        refreshBtn.className = 'quote__refresh';
        refreshBtn.innerHTML = '<i class="fas fa-sync-alt"></i> Обновить цитату';
        
        container.appendChild(this.quoteText);
        container.appendChild(this.quoteAuthor);
        container.appendChild(refreshBtn);
        
        this.addEventListener(refreshBtn, 'click', () => this.fetchQuote());
        
        // Загружаем первую цитату
        this.fetchQuote();
        
        return this.createWidgetWrapper(container);
    }

    async fetchQuote() {
        if (this.isLoading) return;
        
        this.isLoading = true;
        this.quoteText.innerHTML = '<div class="widget__loading"><i class="fas fa-spinner fa-pulse"></i><br>Загрузка...</div>';
        this.quoteAuthor.innerHTML = '';
        
        try {
            // Используем бесплатное API для цитат (Quotable.io)
            const response = await fetch('https://api.quotable.io/random?tags=inspirational|wisdom|motivational');
            
            if (!response.ok) {
                throw new Error('Ошибка загрузки');
            }
            
            const data = await response.json();
            
            this.quote = {
                text: `"${data.content}"`,
                author: data.author
            };
            
            this.quoteText.innerHTML = this.quote.text;
            this.quoteAuthor.innerHTML = `— ${this.quote.author}`;
            
        } catch (error) {
            console.error('Ошибка получения цитаты:', error);
            // Используем локальную цитату-запасную
            this.quote = {
                text: '"Путешествие в тысячу миль начинается с одного шага."',
                author: 'Лао Цзы'
            };
            this.quoteText.innerHTML = this.quote.text;
            this.quoteAuthor.innerHTML = `— ${this.quote.author}`;
        }
        
        this.isLoading = false;
    }
}