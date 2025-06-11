// Utilitários JavaScript para o projeto Geraldo Sense

// Classe de utilitários
class Utils {
    // Debounce para otimizar performance
    static debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Throttle para limitar execução
    static throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // Verificar se elemento está visível
    static isElementInViewport(el) {
        const rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Animar elemento com fade in
    static fadeIn(element, duration = 800) {
        element.style.opacity = '0';
        element.style.transition = `opacity ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
        }, 10);
    }

    // Animar elemento com fade out
    static fadeOut(element, duration = 800) {
        element.style.transition = `opacity ${duration}ms ease`;
        element.style.opacity = '0';
        
        setTimeout(() => {
            element.style.display = 'none';
        }, duration);
    }

    // Adicionar classe com delay
    static addClassWithDelay(element, className, delay = 0) {
        setTimeout(() => {
            element.classList.add(className);
        }, delay);
    }

    // Remover classe com delay
    static removeClassWithDelay(element, className, delay = 0) {
        setTimeout(() => {
            element.classList.remove(className);
        }, delay);
    }

    // Gerar ID único
    static generateId() {
        return 'id_' + Math.random().toString(36).substr(2, 9);
    }

    // Formatar data
    static formatDate(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    }

    // Validar email
    static isValidEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    // Copiar texto para clipboard
    static async copyToClipboard(text) {
        try {
            await navigator.clipboard.writeText(text);
            return true;
        } catch (err) {
            console.error('Erro ao copiar texto:', err);
            return false;
        }
    }

    // Detectar dispositivo móvel
    static isMobile() {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // Detectar orientação da tela
    static getOrientation() {
        return window.innerHeight > window.innerWidth ? 'portrait' : 'landscape';
    }

    // Prevenir scroll do body
    static preventScroll() {
        document.body.style.overflow = 'hidden';
    }

    // Permitir scroll do body
    static allowScroll() {
        document.body.style.overflow = '';
    }

    // Smooth scroll para elemento
    static smoothScrollTo(element, offset = 0) {
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - offset;

        window.scrollTo({
            top: offsetPosition,
            behavior: 'smooth'
        });
    }

    // Criar elemento com atributos
    static createElement(tag, attributes = {}, textContent = '') {
        const element = document.createElement(tag);
        
        Object.keys(attributes).forEach(key => {
            element.setAttribute(key, attributes[key]);
        });
        
        if (textContent) {
            element.textContent = textContent;
        }
        
        return element;
    }

    // Adicionar estilos dinamicamente
    static addStyles(css) {
        const style = document.createElement('style');
        style.textContent = css;
        document.head.appendChild(style);
    }

    // Remover estilos dinamicamente
    static removeStyles(styleElement) {
        if (styleElement && styleElement.parentNode) {
            styleElement.parentNode.removeChild(styleElement);
        }
    }

    // Local Storage helpers
    static setLocalStorage(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (err) {
            console.error('Erro ao salvar no localStorage:', err);
            return false;
        }
    }

    static getLocalStorage(key) {
        try {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (err) {
            console.error('Erro ao ler do localStorage:', err);
            return null;
        }
    }

    static removeLocalStorage(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (err) {
            console.error('Erro ao remover do localStorage:', err);
            return false;
        }
    }

    // Session Storage helpers
    static setSessionStorage(key, value) {
        try {
            sessionStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (err) {
            console.error('Erro ao salvar no sessionStorage:', err);
            return false;
        }
    }

    static getSessionStorage(key) {
        try {
            const item = sessionStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        } catch (err) {
            console.error('Erro ao ler do sessionStorage:', err);
            return null;
        }
    }

    static removeSessionStorage(key) {
        try {
            sessionStorage.removeItem(key);
            return true;
        } catch (err) {
            console.error('Erro ao remover do sessionStorage:', err);
            return false;
        }
    }
}

// Classe para animações
class Animations {
    static fadeInUp(element, duration = 800) {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = `all ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 10);
    }

    static fadeInLeft(element, duration = 800) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(-30px)';
        element.style.transition = `all ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, 10);
    }

    static fadeInRight(element, duration = 800) {
        element.style.opacity = '0';
        element.style.transform = 'translateX(30px)';
        element.style.transition = `all ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'translateX(0)';
        }, 10);
    }

    static scaleIn(element, duration = 600) {
        element.style.opacity = '0';
        element.style.transform = 'scale(0.8)';
        element.style.transition = `all ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.opacity = '1';
            element.style.transform = 'scale(1)';
        }, 10);
    }

    static bounce(element, duration = 600) {
        element.style.animation = `bounce ${duration}ms ease`;
        
        setTimeout(() => {
            element.style.animation = '';
        }, duration);
    }
}

// Classe para validações
class Validations {
    static isRequired(value) {
        return value !== null && value !== undefined && value !== '';
    }

    static minLength(value, min) {
        return value && value.length >= min;
    }

    static maxLength(value, max) {
        return value && value.length <= max;
    }

    static isNumber(value) {
        return !isNaN(value) && typeof Number(value) === 'number';
    }

    static isInteger(value) {
        return Number.isInteger(Number(value));
    }

    static isPositive(value) {
        return this.isNumber(value) && Number(value) > 0;
    }

    static isNegative(value) {
        return this.isNumber(value) && Number(value) < 0;
    }

    static isBetween(value, min, max) {
        return this.isNumber(value) && Number(value) >= min && Number(value) <= max;
    }

    static isUrl(value) {
        try {
            new URL(value);
            return true;
        } catch {
            return false;
        }
    }

    static isPhone(value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        return phoneRegex.test(value.replace(/\s/g, ''));
    }

    static isCPF(value) {
        const cpf = value.replace(/[^\d]/g, '');
        
        if (cpf.length !== 11) return false;
        
        // Verificar se todos os dígitos são iguais
        if (/^(\d)\1{10}$/.test(cpf)) return false;
        
        // Validar primeiro dígito verificador
        let sum = 0;
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf.charAt(i)) * (10 - i);
        }
        let remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(9))) return false;
        
        // Validar segundo dígito verificador
        sum = 0;
        for (let i = 0; i < 10; i++) {
            sum += parseInt(cpf.charAt(i)) * (11 - i);
        }
        remainder = (sum * 10) % 11;
        if (remainder === 10 || remainder === 11) remainder = 0;
        if (remainder !== parseInt(cpf.charAt(10))) return false;
        
        return true;
    }
}

// Exportar classes
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { Utils, Animations, Validations };
} 