// Configurações globais
const CONFIG = {
    animationDelay: 100,
    shimmerInterval: 5000,
    fadeInDuration: 800
};

// Classe principal da aplicação
class GeraldoSenseApp {
    constructor() {
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.startAnimations();
        this.setupIntersectionObserver();
        this.setupAboutMeModal();
        this.setupFooterReveal();
    }

    // Configurar event listeners
    setupEventListeners() {
        // Botão CTA
        const ctaButton = document.querySelector('.cta-button');
        if (ctaButton) {
            ctaButton.addEventListener('click', this.handleCTAClick.bind(this));
        }

        // Imagem de perfil
        const profileImg = document.querySelector('.profile-img');
        if (profileImg) {
            profileImg.addEventListener('click', this.handleProfileClick.bind(this));
        }

        // Cards de features
        const features = document.querySelectorAll('.feature');
        features.forEach(feature => {
            feature.addEventListener('mouseenter', this.handleFeatureHover.bind(this));
            feature.addEventListener('mouseleave', this.handleFeatureLeave.bind(this));
        });

        // Event listeners para responsividade
        window.addEventListener('resize', this.handleResize.bind(this));
        window.addEventListener('scroll', this.handleScroll.bind(this));
    }

    // Configurar modal "Sobre Mim"
    setupAboutMeModal() {
        const aboutMeBtn = document.getElementById('aboutMeBtn');
        const aboutMeModal = document.getElementById('aboutMeModal');
        const closeAboutMe = document.getElementById('closeAboutMe');

        if (aboutMeBtn && aboutMeModal) {
            aboutMeBtn.addEventListener('click', () => {
                this.openAboutMeModal();
            });
        }

        if (closeAboutMe && aboutMeModal) {
            closeAboutMe.addEventListener('click', () => {
                this.closeAboutMeModal();
            });
        }

        // Fechar modal clicando fora
        if (aboutMeModal) {
            aboutMeModal.addEventListener('click', (e) => {
                if (e.target === aboutMeModal) {
                    this.closeAboutMeModal();
                }
            });
        }

        // Fechar modal com ESC
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && aboutMeModal.classList.contains('show')) {
                this.closeAboutMeModal();
            }
        });
    }

    // Configurar revelação do footer
    setupFooterReveal() {
        const footerRevealBtn = document.getElementById('footerRevealBtn');
        const mainFooter = document.getElementById('mainFooter');

        if (footerRevealBtn && mainFooter) {
            footerRevealBtn.addEventListener('click', () => {
                this.toggleFooter();
            });
        }
    }

    // Alternar visibilidade do footer
    toggleFooter() {
        const footerRevealBtn = document.getElementById('footerRevealBtn');
        const mainFooter = document.getElementById('mainFooter');

        if (mainFooter.classList.contains('footer-hidden')) {
            // Revelar footer
            mainFooter.classList.remove('footer-hidden');
            mainFooter.classList.add('footer-visible');
            footerRevealBtn.classList.add('revealed');
            footerRevealBtn.innerHTML = '<i class="fas fa-chevron-up"></i><span>Ocultar informações</span>';
            
            // Animar entrada do footer
            this.animateFooterReveal();
            
            // Scroll suave para o footer
            setTimeout(() => {
                mainFooter.scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
            }, 300);
        } else {
            // Ocultar footer
            mainFooter.classList.remove('footer-visible');
            mainFooter.classList.add('footer-hidden');
            footerRevealBtn.classList.remove('revealed');
            footerRevealBtn.innerHTML = '<i class="fas fa-chevron-down"></i><span>Ver mais informações</span>';
        }
    }

    // Animar entrada do footer
    animateFooterReveal() {
        const footerSections = document.querySelectorAll('.footer-section');
        const socialIcons = document.querySelectorAll('.social-icon');
        const footerBottom = document.querySelector('.footer-bottom');

        // Animar seções do footer
        footerSections.forEach((section, index) => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(20px)';
            section.style.transition = 'all 0.6s ease';
            
            setTimeout(() => {
                section.style.opacity = '1';
                section.style.transform = 'translateY(0)';
            }, 100 + (index * 150));
        });

        // Animar ícones sociais
        socialIcons.forEach((icon, index) => {
            icon.style.opacity = '0';
            icon.style.transform = 'scale(0.8)';
            icon.style.transition = 'all 0.4s ease';
            
            setTimeout(() => {
                icon.style.opacity = '1';
                icon.style.transform = 'scale(1)';
            }, 800 + (index * 100));
        });

        // Animar footer bottom
        if (footerBottom) {
            footerBottom.style.opacity = '0';
            footerBottom.style.transform = 'translateY(10px)';
            footerBottom.style.transition = 'all 0.5s ease';
            
            setTimeout(() => {
                footerBottom.style.opacity = '1';
                footerBottom.style.transform = 'translateY(0)';
            }, 1200);
        }
    }

    // Abrir modal "Sobre Mim"
    openAboutMeModal() {
        const modal = document.getElementById('aboutMeModal');
        if (modal) {
            modal.classList.add('show');
            document.body.style.overflow = 'hidden';
            
            // Animar entrada dos elementos
            this.animateModalContent();
            
            // Trigger custom event
            modal.dispatchEvent(new CustomEvent('modal:opened', { 
                detail: { modal: 'aboutMe' } 
            }));
        }
    }

    // Fechar modal "Sobre Mim"
    closeAboutMeModal() {
        const modal = document.getElementById('aboutMeModal');
        if (modal) {
            modal.classList.remove('show');
            document.body.style.overflow = '';
            
            // Trigger custom event
            modal.dispatchEvent(new CustomEvent('modal:closed', { 
                detail: { modal: 'aboutMe' } 
            }));
        }
    }

    // Animar conteúdo do modal
    animateModalContent() {
        const sections = document.querySelectorAll('.about-section');
        const interestItems = document.querySelectorAll('.interest-item');
        const goalItems = document.querySelectorAll('.goal-item');
        const techTags = document.querySelectorAll('.tech-tag');

        // Animar seções
        sections.forEach((section, index) => {
            setTimeout(() => {
                section.style.opacity = '0';
                section.style.transform = 'translateY(20px)';
                section.style.transition = 'all 0.6s ease';
                
                setTimeout(() => {
                    section.style.opacity = '1';
                    section.style.transform = 'translateY(0)';
                }, 50);
            }, index * 200);
        });

        // Animar itens de interesse
        interestItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                item.style.transition = 'all 0.4s ease';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 50);
            }, 1000 + (index * 100));
        });

        // Animar objetivos
        goalItems.forEach((item, index) => {
            setTimeout(() => {
                item.style.opacity = '0';
                item.style.transform = 'translateX(-20px)';
                item.style.transition = 'all 0.5s ease';
                
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'translateX(0)';
                }, 50);
            }, 2000 + (index * 150));
        });

        // Animar tags de tecnologia
        techTags.forEach((tag, index) => {
            setTimeout(() => {
                tag.style.opacity = '0';
                tag.style.transform = 'translateY(10px)';
                tag.style.transition = 'all 0.3s ease';
                
                setTimeout(() => {
                    tag.style.opacity = '1';
                    tag.style.transform = 'translateY(0)';
                }, 50);
            }, 3000 + (index * 50));
        });
    }

    // Iniciar animações
    startAnimations() {
        setTimeout(() => {
            this.fadeInContainer();
        }, CONFIG.animationDelay);
    }

    // Animação de entrada do container
    fadeInContainer() {
        const container = document.querySelector('.container');
        if (container) {
            container.style.opacity = '0';
            container.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                container.style.transition = `all ${CONFIG.fadeInDuration}ms ease`;
                container.style.opacity = '1';
                container.style.transform = 'translateY(0)';
            }, 100);
        }
    }

    // Configurar Intersection Observer para animações
    setupIntersectionObserver() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, observerOptions);

        // Observar elementos com classe fade-in
        const fadeElements = document.querySelectorAll('.fade-in');
        fadeElements.forEach(el => observer.observe(el));
    }

    // Handlers de eventos
    handleCTAClick(event) {
        event.preventDefault();
        // Agora o botão abre o modal "Sobre Mim"
        this.openAboutMeModal();
    }

    handleProfileClick(event) {
        this.showNotification('Geraldo Sense - Desenvolvedor e Criador de Conteúdo');
    }

    handleFeatureHover(event) {
        const feature = event.currentTarget;
        this.addHoverEffect(feature);
    }

    handleFeatureLeave(event) {
        const feature = event.currentTarget;
        this.removeHoverEffect(feature);
    }

    handleResize(event) {
        this.adjustLayout();
    }

    handleScroll(event) {
        this.handleParallaxEffect();
    }

    // Efeitos visuais
    addHoverEffect(element) {
        element.style.transform = 'translateY(-8px) scale(1.02)';
        element.style.boxShadow = '0 15px 35px rgba(0, 0, 0, 0.15)';
    }

    removeHoverEffect(element) {
        element.style.transform = 'translateY(0) scale(1)';
        element.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.1)';
    }

    // Ajustar layout responsivo
    adjustLayout() {
        const width = window.innerWidth;
        const container = document.querySelector('.container');
        
        if (width < 768) {
            container.style.maxWidth = '95%';
        } else {
            container.style.maxWidth = '800px';
        }
    }

    // Efeito parallax simples
    handleParallaxEffect() {
        const scrolled = window.pageYOffset;
        const parallaxElements = document.querySelectorAll('.feature');
        
        parallaxElements.forEach((element, index) => {
            const speed = 0.5 + (index * 0.1);
            const yPos = -(scrolled * speed);
            element.style.transform = `translateY(${yPos}px)`;
        });
    }

    // Sistema de notificações
    showNotification(message) {
        // Criar elemento de notificação
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Estilos da notificação
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(45deg, #667eea, #764ba2);
            color: white;
            padding: 15px 25px;
            border-radius: 10px;
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
            z-index: 1000;
            transform: translateX(100%);
            transition: transform 0.3s ease;
            max-width: 300px;
            font-size: 14px;
        `;
        
        document.body.appendChild(notification);
        
        // Animar entrada
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Remover após 3 segundos
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }

    // Utilitários
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
}

// Inicializar aplicação quando o DOM estiver pronto
document.addEventListener('DOMContentLoaded', () => {
    new GeraldoSenseApp();
});

// Exportar para uso em outros módulos (se necessário)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = GeraldoSenseApp;
} 