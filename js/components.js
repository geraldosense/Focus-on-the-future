// Componentes JavaScript reutilizáveis para o projeto Geraldo Sense

// Classe para gerenciar modais
class Modal {
    constructor(id, options = {}) {
        this.id = id;
        this.options = {
            closeOnOutsideClick: true,
            closeOnEscape: true,
            ...options
        };
        this.element = document.getElementById(id);
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.element) return;

        // Criar estrutura do modal se não existir
        if (!this.element.querySelector('.modal-content')) {
            this.createModalStructure();
        }

        this.setupEventListeners();
    }

    createModalStructure() {
        this.element.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3 class="modal-title">Título do Modal</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    Conteúdo do modal
                </div>
            </div>
        `;
    }

    setupEventListeners() {
        const closeBtn = this.element.querySelector('.modal-close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => this.close());
        }

        if (this.options.closeOnOutsideClick) {
            this.element.addEventListener('click', (e) => {
                if (e.target === this.element) {
                    this.close();
                }
            });
        }

        if (this.options.closeOnEscape) {
            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && this.isOpen) {
                    this.close();
                }
            });
        }
    }

    open() {
        this.element.classList.add('show');
        this.isOpen = true;
        document.body.style.overflow = 'hidden';
        
        // Trigger custom event
        this.element.dispatchEvent(new CustomEvent('modal:opened', { detail: { modal: this } }));
    }

    close() {
        this.element.classList.remove('show');
        this.isOpen = false;
        document.body.style.overflow = '';
        
        // Trigger custom event
        this.element.dispatchEvent(new CustomEvent('modal:closed', { detail: { modal: this } }));
    }

    setContent(title, content) {
        const titleEl = this.element.querySelector('.modal-title');
        const bodyEl = this.element.querySelector('.modal-body');
        
        if (titleEl) titleEl.textContent = title;
        if (bodyEl) bodyEl.innerHTML = content;
    }

    setTitle(title) {
        const titleEl = this.element.querySelector('.modal-title');
        if (titleEl) titleEl.textContent = title;
    }

    setBody(content) {
        const bodyEl = this.element.querySelector('.modal-body');
        if (bodyEl) bodyEl.innerHTML = content;
    }
}

// Classe para gerenciar tooltips
class Tooltip {
    constructor(element, options = {}) {
        this.element = element;
        this.options = {
            text: '',
            position: 'top',
            delay: 200,
            ...options
        };
        this.tooltip = null;
        this.timeout = null;
        this.init();
    }

    init() {
        this.element.classList.add('tooltip');
        this.createTooltip();
        this.setupEventListeners();
    }

    createTooltip() {
        this.tooltip = document.createElement('span');
        this.tooltip.className = 'tooltip-text';
        this.tooltip.textContent = this.options.text;
        this.element.appendChild(this.tooltip);
    }

    setupEventListeners() {
        this.element.addEventListener('mouseenter', () => this.show());
        this.element.addEventListener('mouseleave', () => this.hide());
    }

    show() {
        clearTimeout(this.timeout);
        this.timeout = setTimeout(() => {
            this.tooltip.style.visibility = 'visible';
            this.tooltip.style.opacity = '1';
        }, this.options.delay);
    }

    hide() {
        clearTimeout(this.timeout);
        this.tooltip.style.visibility = 'hidden';
        this.tooltip.style.opacity = '0';
    }

    setText(text) {
        this.options.text = text;
        this.tooltip.textContent = text;
    }
}

// Classe para gerenciar formulários
class Form {
    constructor(formElement, options = {}) {
        this.form = formElement;
        this.options = {
            validateOnInput: true,
            validateOnBlur: true,
            ...options
        };
        this.fields = new Map();
        this.init();
    }

    init() {
        this.setupFields();
        this.setupEventListeners();
    }

    setupFields() {
        const inputs = this.form.querySelectorAll('input, textarea, select');
        inputs.forEach(input => {
            const field = new FormField(input, this);
            this.fields.set(input.name, field);
        });
    }

    setupEventListeners() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();
        
        if (this.validate()) {
            this.submit();
        }
    }

    validate() {
        let isValid = true;
        
        this.fields.forEach(field => {
            if (!field.validate()) {
                isValid = false;
            }
        });
        
        return isValid;
    }

    async submit() {
        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData.entries());
        
        // Trigger custom event
        this.form.dispatchEvent(new CustomEvent('form:submit', { 
            detail: { form: this, data } 
        }));
    }

    getField(name) {
        return this.fields.get(name);
    }

    setFieldValue(name, value) {
        const field = this.fields.get(name);
        if (field) {
            field.setValue(value);
        }
    }

    getValues() {
        const data = {};
        this.fields.forEach((field, name) => {
            data[name] = field.getValue();
        });
        return data;
    }

    reset() {
        this.form.reset();
        this.fields.forEach(field => field.clearError());
    }
}

// Classe para campos de formulário
class FormField {
    constructor(input, form) {
        this.input = input;
        this.form = form;
        this.errorElement = null;
        this.rules = [];
        this.init();
    }

    init() {
        this.createErrorElement();
        this.setupEventListeners();
        this.parseRules();
    }

    createErrorElement() {
        this.errorElement = document.createElement('div');
        this.errorElement.className = 'form-error';
        this.input.parentNode.appendChild(this.errorElement);
    }

    setupEventListeners() {
        if (this.form.options.validateOnInput) {
            this.input.addEventListener('input', () => this.validate());
        }
        
        if (this.form.options.validateOnBlur) {
            this.input.addEventListener('blur', () => this.validate());
        }
    }

    parseRules() {
        const rules = this.input.dataset.rules;
        if (rules) {
            this.rules = rules.split('|').map(rule => {
                const [name, ...params] = rule.split(':');
                return { name, params };
            });
        }
    }

    validate() {
        let isValid = true;
        let errorMessage = '';

        for (const rule of this.rules) {
            const validator = Validators[rule.name];
            if (validator) {
                const result = validator(this.getValue(), ...rule.params);
                if (!result.valid) {
                    isValid = false;
                    errorMessage = result.message;
                    break;
                }
            }
        }

        if (isValid) {
            this.clearError();
        } else {
            this.showError(errorMessage);
        }

        return isValid;
    }

    showError(message) {
        this.input.classList.add('error');
        this.errorElement.textContent = message;
        this.errorElement.style.display = 'block';
    }

    clearError() {
        this.input.classList.remove('error');
        this.errorElement.style.display = 'none';
    }

    getValue() {
        return this.input.value;
    }

    setValue(value) {
        this.input.value = value;
    }
}

// Validadores
const Validators = {
    required: (value) => ({
        valid: value !== null && value !== undefined && value !== '',
        message: 'Este campo é obrigatório'
    }),

    email: (value) => ({
        valid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value),
        message: 'Email inválido'
    }),

    minLength: (value, min) => ({
        valid: value.length >= parseInt(min),
        message: `Mínimo de ${min} caracteres`
    }),

    maxLength: (value, max) => ({
        valid: value.length <= parseInt(max),
        message: `Máximo de ${max} caracteres`
    }),

    phone: (value) => ({
        valid: /^[\+]?[1-9][\d]{0,15}$/.test(value.replace(/\s/g, '')),
        message: 'Telefone inválido'
    }),

    cpf: (value) => {
        const cpf = value.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) {
            return { valid: false, message: 'CPF inválido' };
        }
        
        if (/^(\d)\1{10}$/.test(cpf)) {
            return { valid: false, message: 'CPF inválido' };
        }
        
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) {
            return { valid: false, message: 'CPF inválido' };
        }
        
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) {
            return { valid: false, message: 'CPF inválido' };
        }
        
        return { valid: true, message: '' };
    }
};

// Classe para gerenciar notificações
class Notification {
    static show(message, type = 'info', duration = 3000) {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
            max-width: 300px;
            animation: slideInRight 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, duration);
    }

    static success(message, duration) {
        this.show(message, 'success', duration);
    }

    static error(message, duration) {
        this.show(message, 'danger', duration);
    }

    static warning(message, duration) {
        this.show(message, 'warning', duration);
    }

    static info(message, duration) {
        this.show(message, 'info', duration);
    }
}

// Classe para gerenciar carregamento
class Loading {
    static show(container, text = 'Carregando...') {
        const loading = document.createElement('div');
        loading.className = 'loading-container';
        loading.innerHTML = `
            <div class="loading loading-large"></div>
            <p>${text}</p>
        `;
        
        loading.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            padding: 40px;
            color: #718096;
        `;
        
        container.appendChild(loading);
        return loading;
    }

    static hide(loadingElement) {
        if (loadingElement && loadingElement.parentNode) {
            loadingElement.parentNode.removeChild(loadingElement);
        }
    }
}

// Classe para gerenciar tabs
class Tabs {
    constructor(container, options = {}) {
        this.container = container;
        this.options = {
            activeTab: 0,
            ...options
        };
        this.tabs = [];
        this.panels = [];
        this.init();
    }

    init() {
        this.setupTabs();
        this.setupEventListeners();
        this.showTab(this.options.activeTab);
    }

    setupTabs() {
        const tabElements = this.container.querySelectorAll('[data-tab]');
        const panelElements = this.container.querySelectorAll('[data-panel]');
        
        tabElements.forEach((tab, index) => {
            this.tabs.push(tab);
            this.panels.push(panelElements[index]);
        });
    }

    setupEventListeners() {
        this.tabs.forEach((tab, index) => {
            tab.addEventListener('click', () => this.showTab(index));
        });
    }

    showTab(index) {
        // Esconder todos os painéis
        this.panels.forEach(panel => {
            panel.style.display = 'none';
        });
        
        // Remover classe ativa de todas as tabs
        this.tabs.forEach(tab => {
            tab.classList.remove('active');
        });
        
        // Mostrar painel selecionado
        if (this.panels[index]) {
            this.panels[index].style.display = 'block';
        }
        
        // Ativar tab selecionada
        if (this.tabs[index]) {
            this.tabs[index].classList.add('active');
        }
    }
}

// Exportar classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { 
        Modal, 
        Tooltip, 
        Form, 
        FormField, 
        Validators, 
        Notification, 
        Loading, 
        Tabs 
    };
} 