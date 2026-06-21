/**
 * Clase Carrusel - Controla la funcionalidad del carrusel de imágenes
 * Versión con diseño minimalista y colores claros
 */
class Carrusel {
    /**
     * Constructor de la clase Carrusel
     * @param {Object} config - Configuración del carrusel
     */
    constructor(config = {}) {
        this.currentIndex = 0;
        this.totalItems = 5;
        this.items = [];
        this.indicators = [];
        this.track = null;
        this.counter = null;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = config.autoPlayDelay || 5000;
        
        // Inicializar elementos
        this.initElements();
        this.initEventListeners();
        this.updateCarrusel();
        this.startAutoPlay();
    }
    
    /**
     * Inicializa los elementos DOM del carrusel
     */
    initElements() {
        this.track = document.getElementById('carruselTrack');
        this.items = document.querySelectorAll('.carrusel-item');
        this.indicators = document.querySelectorAll('.dot');
        this.counter = document.getElementById('counter');
        this.totalItems = this.items.length;
        
        // Verificar que existan todos los elementos necesarios
        if (!this.track || !this.items.length || !this.indicators.length) {
            console.error('Error: Elementos del carrusel no encontrados');
            return;
        }
    }
    
    /**
     * Inicializa los event listeners para los botones y elementos interactivos
     */
    initEventListeners() {
        // Botón siguiente
        const nextBtn = document.getElementById('nextBtn');
        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }
        
        // Botón anterior
        const prevBtn = document.getElementById('prevBtn');
        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }
        
        // Indicadores (dots)
        this.indicators.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goTo(index));
            // Soporte para accesibilidad
            dot.addEventListener('keydown', (e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    this.goTo(index);
                }
            });
        });
        
        // Teclado - navegación con flechas
        document.addEventListener('keydown', (e) => {
            // Solo si el foco no está en un input o textarea
            const tag = e.target.tagName.toLowerCase();
            if (tag === 'input' || tag === 'textarea') return;
            
            if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.next();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prev();
            }
        });
        
        // Touch events para móviles
        this.setupTouchEvents();
        
        // Pausar autoplay al hacer hover
        const carruselContainer = document.querySelector('.carrusel');
        if (carruselContainer) {
            carruselContainer.addEventListener('mouseenter', () => this.stopAutoPlay());
            carruselContainer.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
    
    /**
     * Configura los eventos táctiles para navegación en móviles
     */
    setupTouchEvents() {
        let touchStartX = 0;
        let touchStartY = 0;
        let touchEndX = 0;
        let touchEndY = 0;
        const carruselContainer = document.querySelector('.carrusel');
        
        if (!carruselContainer) return;
        
        carruselContainer.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });
        
        carruselContainer.addEventListener('touchmove', (e) => {
            // Prevenir scroll vertical durante el swipe horizontal
            const deltaX = Math.abs(e.changedTouches[0].screenX - touchStartX);
            const deltaY = Math.abs(e.changedTouches[0].screenY - touchStartY);
            if (deltaX > deltaY) {
                e.preventDefault();
            }
        }, { passive: false });
        
        carruselContainer.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            touchEndY = e.changedTouches[0].screenY;
            this.handleSwipe(touchStartX, touchEndX, touchStartY, touchEndY);
        }, { passive: true });
    }
    
    /**
     * Maneja el gesto de swipe para navegación
     * @param {number} startX - Posición inicial del touch
     * @param {number} endX - Posición final del touch
     * @param {number} startY - Posición Y inicial
     * @param {number} endY - Posición Y final
     */
    handleSwipe(startX, endX, startY, endY) {
        const threshold = 50;
        const diffX = startX - endX;
        const diffY = startY - endY;
        
        // Determinar si el swipe es horizontal
        if (Math.abs(diffX) < Math.abs(diffY)) return;
        if (Math.abs(diffX) < threshold) return;
        
        if (diffX > 0) {
            this.next();
        } else {
            this.prev();
        }
    }
    
    /**
     * Navega a la siguiente imagen
     */
    next() {
        if (this.isAnimating) return;
        const nextIndex = (this.currentIndex + 1) % this.totalItems;
        this.goTo(nextIndex);
    }
    
    /**
     * Navega a la imagen anterior
     */
    prev() {
        if (this.isAnimating) return;
        const prevIndex = (this.currentIndex - 1 + this.totalItems) % this.totalItems;
        this.goTo(prevIndex);
    }
    
    /**
     * Navega a una imagen específica
     * @param {number} index - Índice de la imagen a mostrar
     */
    goTo(index) {
        if (this.isAnimating || index === this.currentIndex) return;
        
        this.isAnimating = true;
        this.currentIndex = index;
        this.updateCarrusel();
        
        // Resetear el autoplay cuando el usuario interactúa
        this.resetAutoPlay();
        
        // Desbloquear animación después de la transición
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    /**
     * Actualiza la visualización del carrusel
     */
    updateCarrusel() {
        // Actualizar track (desplazamiento)
        if (this.track) {
            this.track.style.transform = `translateX(-${this.currentIndex * 100}%)`;
        }
        
        // Actualizar items (clase active)
        this.items.forEach((item, index) => {
            item.classList.toggle('active', index === this.currentIndex);
        });
        
        // Actualizar indicadores
        this.indicators.forEach((dot, index) => {
            const isActive = index === this.currentIndex;
            dot.classList.toggle('active', isActive);
            dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
        });
        
        // Actualizar contador con formato de dos dígitos
        if (this.counter) {
            const current = String(this.currentIndex + 1).padStart(2, '0');
            const total = String(this.totalItems).padStart(2, '0');
            this.counter.textContent = `${current} / ${total}`;
        }
    }
    
    /**
     * Inicia el autoplay del carrusel
     */
    startAutoPlay() {
        if (this.autoPlayInterval) return;
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }
    
    /**
     * Detiene el autoplay del carrusel
     */
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    /**
     * Reinicia el autoplay del carrusel
     */
    resetAutoPlay() {
        this.stopAutoPlay();
        this.startAutoPlay();
    }
    
    /**
     * Método para limpiar el carrusel (destructor)
     */
    destroy() {
        this.stopAutoPlay();
        // Remover event listeners si es necesario
        const carruselContainer = document.querySelector('.carrusel');
        if (carruselContainer) {
            carruselContainer.removeEventListener('mouseenter', () => this.stopAutoPlay());
            carruselContainer.removeEventListener('mouseleave', () => this.startAutoPlay());
        }
    }
}

// Inicializar el carrusel cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    const carrusel = new Carrusel({
        autoPlayDelay: 5000
    });
    
    // Exponer el carrusel globalmente para debugging
    window.carruselApp = carrusel;
});