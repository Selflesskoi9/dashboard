import UIComponent from './UIComponent.js';

/**
 * Виджет "Список дел"
 * Позволяет добавлять, удалять и отмечать выполненные задачи
 */
export default class ToDoWidget extends UIComponent {
    constructor(config = {}) {
        super({ ...config, title: config.title || 'Список дел' });
        this.tasks = config.tasks || [];
    }

    getTitleIcon() {
        return '<i class="fas fa-check-circle"></i> ';
    }

    render() {
        const container = document.createElement('div');
        container.className = 'todo__widget';
        
        // Создаем форму добавления задачи
        const inputGroup = document.createElement('div');
        inputGroup.className = 'todo__input-group';
        
        this.input = document.createElement('input');
        this.input.type = 'text';
        this.input.placeholder = 'Новая задача...';
        this.input.className = 'todo__input';
        
        const addBtn = document.createElement('button');
        addBtn.className = 'todo__add';
        addBtn.innerHTML = '<i class="fas fa-plus"></i>';
        
        inputGroup.appendChild(this.input);
        inputGroup.appendChild(addBtn);
        
        // Создаем список задач
        this.taskList = document.createElement('ul');
        this.taskList.className = 'todo__list';
        
        container.appendChild(inputGroup);
        container.appendChild(this.taskList);
        
        // Обработчики событий
        this.addEventListener(addBtn, 'click', () => this.addTask());
        this.addEventListener(this.input, 'keypress', (e) => {
            if (e.key === 'Enter') this.addTask();
        });
        
        // Рендерим существующие задачи
        this.renderTasks();
        
        return this.createWidgetWrapper(container);
    }

    addTask() {
        const text = this.input.value.trim();
        if (!text) return;
        
        const task = {
            id: Date.now(),
            text: text,
            completed: false
        };
        
        this.tasks.push(task);
        this.renderTasks();
        this.input.value = '';
        this.input.focus();
    }

    deleteTask(taskId) {
        this.tasks = this.tasks.filter(task => task.id !== taskId);
        this.renderTasks();
    }

    toggleTask(taskId) {
        const task = this.tasks.find(t => t.id === taskId);
        if (task) {
            task.completed = !task.completed;
            this.renderTasks();
        }
    }

    renderTasks() {
        this.taskList.innerHTML = '';
        
        if (this.tasks.length === 0) {
            const emptyItem = document.createElement('li');
            emptyItem.className = 'todo__item';
            emptyItem.style.justifyContent = 'center';
            emptyItem.style.color = 'var(--text-secondary)';
            emptyItem.innerHTML = '<i class="fas fa-inbox"></i> Нет задач';
            this.taskList.appendChild(emptyItem);
            return;
        }
        
        this.tasks.forEach(task => {
            const li = document.createElement('li');
            li.className = 'todo__item';
            
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.className = 'todo__checkbox';
            checkbox.checked = task.completed;
            this.addEventListener(checkbox, 'change', () => this.toggleTask(task.id));
            
            const span = document.createElement('span');
            span.className = `todo__text ${task.completed ? 'completed' : ''}`;
            span.textContent = task.text;
            
            const deleteBtn = document.createElement('button');
            deleteBtn.className = 'todo__delete';
            deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';
            this.addEventListener(deleteBtn, 'click', () => this.deleteTask(task.id));
            
            li.appendChild(checkbox);
            li.appendChild(span);
            li.appendChild(deleteBtn);
            this.taskList.appendChild(li);
        });
    }
}