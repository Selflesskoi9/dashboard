import UIComponent from './UIComponent.js';

/**
 * Виджет "Случайная цитата"
 * Получает данные с API Ninjas (работает в России)
 */
export default class QuoteWidget extends UIComponent {
    constructor(config = {}) {
        super({ ...config, title: config.title || 'Цитата дня' });
        this.currentQuote = { text: 'Загрузка...', author: '' };
        this.isLoading = false;
        
        // Резервные цитаты (на случай, если API не ответит)
        this.fallbackQuotes = [
            { text: 'Путешествие в тысячу миль начинается с одного шага.', author: 'Лао Цзы' },
            { text: 'Единственный способ сделать великую работу — любить то, что ты делаешь.', author: 'Стив Джобс' },
            { text: 'Жизнь — это то, что с тобой происходит, пока ты строишь планы.', author: 'Джон Леннон' },
            { text: 'Будьте изменением, которое вы хотите видеть в мире.', author: 'Махатма Ганди' },
            { text: 'Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма.', author: 'Уинстон Черчилль' }
        ];
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
        this.showLoading();
        
        try {
            // Используем API Ninjas (работает в России, бесплатно)
            const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
                headers: { 'X-Api-Key': 'YOUR_API_KEY' } // Нужен бесплатный ключ
            });
            
            if (!response.ok) {
                throw new Error('API не ответил');
            }
            
            const data = await response.json();
            if (data && data[0]) {
                this.currentQuote = {
                    text: `"${data[0].quote}"`,
                    author: data[0].author
                };
            } else {
                throw new Error('Нет данных');
            }
            
        } catch (error) {
            console.warn('Ошибка API, использую локальную цитату:', error);
            // Используем случайную резервную цитату
            const randomIndex = Math.floor(Math.random() * this.fallbackQuotes.length);
            this.currentQuote = {
                text: `"${this.fallbackQuotes[randomIndex].text}"`,
                author: this.fallbackQuotes[randomIndex].author
            };
        }
        
        this.displayQuote();
        this.isLoading = false;
    }

    showLoading() {
        this.quoteText.innerHTML = '<i class="fas fa-spinner fa-pulse"></i> Загрузка цитаты...';
        this.quoteAuthor.innerHTML = '';
    }

    displayQuote() {
        this.quoteText.innerHTML = this.currentQuote.text;
        this.quoteAuthor.innerHTML = `— ${this.currentQuote.author}`;
    }
}
