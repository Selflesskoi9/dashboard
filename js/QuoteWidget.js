import UIComponent from './UIComponent.js';

/**
 * Виджет "Случайная цитата"
 * Получает данные с внешнего API с несколькими резервными источниками
 */
export default class QuoteWidget extends UIComponent {
    constructor(config = {}) {
        super({ ...config, title: config.title || 'Цитата дня' });
        this.quote = { text: 'Загрузка...', author: '' };
        this.isLoading = false;
        
        // Встроенный резервный список цитат
        this.fallbackQuotes = [
            { text: 'Путешествие в тысячу миль начинается с одного шага.', author: 'Лао Цзы' },
            { text: 'Единственный способ сделать великую работу — любить то, что ты делаешь.', author: 'Стив Джобс' },
            { text: 'Жизнь — это то, что с тобой происходит, пока ты строишь планы.', author: 'Джон Леннон' },
            { text: 'Будьте изменением, которое вы хотите видеть в мире.', author: 'Махатма Ганди' },
            { text: 'Успех — это способность идти от неудачи к неудаче, не теряя энтузиазма.', author: 'Уинстон Черчилль' },
            { text: 'Самое difícil — это начать действовать, остальное зависит только от упорства.', author: 'Амелия Эрхарт' },
            { text: 'Вдохновение приходит только во время работы.', author: 'Габриэль Гарсиа Маркес' },
            { text: 'Не бойтесь ошибаться — бойтесь повторять ошибки.', author: 'Теодор Рузвельт' },
            { text: 'Лучшее время посадить дерево было 20 лет назад. Следующее лучшее время — сегодня.', author: 'Китайская пословица' },
            { text: 'Тот, кто не рискует, тот не пьет шампанское.', author: 'Русская пословица' }
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
            let success = false;
            
            // Пробуем первый API: Ninja Quotes (требуется ключ, пробуем без него)
            success = await this.tryNinjaApi();
            
            // Если первый не сработал, пробуем второй: Quotable API
            if (!success) {
                success = await this.tryQuotableApi();
            }
            
            // Если API не работают, используем локальный массив
            if (!success) {
                this.useFallbackQuote();
            }
            
        } catch (error) {
            console.warn('Ошибка получения цитаты из API:', error);
            this.useFallbackQuote();
        }
        
        this.isLoading = false;
    }

    async tryQuotableApi() {
        try {
            // Quotable API часто блокируется, пробуем с таймаутом
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('https://api.quotable.io/random', {
                signal: controller.signal
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) return false;
            
            const data = await response.json();
            this.quote = {
                text: `"${data.content}"`,
                author: data.author
            };
            this.displayQuote();
            return true;
            
        } catch (error) {
            console.log('Quotable API недоступен:', error.message);
            return false;
        }
    }

    async tryNinjaApi() {
        try {
            // Ninja API с категориями
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 5000);
            
            const response = await fetch('https://api.api-ninjas.com/v1/quotes?category=inspirational', {
                headers: { 'X-Api-Key': 'YOUR_API_KEY_HERE' } // Без ключа не работает
            });
            
            clearTimeout(timeoutId);
            
            if (!response.ok) return false;
            
            const data = await response.json();
            if (data && data[0]) {
                this.quote = {
                    text: `"${data[0].quote}"`,
                    author: data[0].author
                };
                this.displayQuote();
                return true;
            }
            return false;
            
        } catch (error) {
            console.log('Ninja API недоступен:', error.message);
            return false;
        }
    }

    useFallbackQuote() {
        const randomIndex = Math.floor(Math.random() * this.fallbackQuotes.length);
        const quote = this.fallbackQuotes[randomIndex];
        this.quote = {
            text: `"${quote.text}"`,
            author: quote.author
        };
        this.displayQuote();
    }

    showLoading() {
        this.quoteText.innerHTML = '<div class="widget__loading"><i class="fas fa-spinner fa-pulse"></i><br>Загрузка...</div>';
        this.quoteAuthor.innerHTML = '';
    }

    displayQuote() {
        this.quoteText.innerHTML = this.quote.text;
        this.quoteAuthor.innerHTML = `— ${this.quote.author}`;
    }
}
