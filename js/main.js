/**
 * ============================================
 * MAIN.JS
 * Main application initialization
 * ============================================
 */

class App {
    constructor() {
        // State
        this.darkMode = true;
        
        // Bind methods
        this.onKeyDown = this.onKeyDown.bind(this);
        
        // Initialize when DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => this.init());
        } else {
            this.init();
        }
    }
    
    init() {
        // Set up keyboard shortcuts
        document.addEventListener('keydown', this.onKeyDown);
        
        // Set up scroll to top
        this.setupScrollToTop();
        
        // Set up smooth scroll for anchor links
        this.setupSmoothScroll();
        
        // Set up time display
        this.setupTimeDisplay();
        
        // Check for reduced motion preference
        this.checkReducedMotion();
        
        // Log ready
        console.log('🚀 Portfolio initialized');
    }
    
    /**
     * Handle keyboard shortcuts
     */
    onKeyDown(e) {
        // D key: Toggle dark mode
        if (e.key === 'd' && !e.ctrlKey && !e.metaKey) {
            const isInputFocused = document.activeElement.tagName === 'INPUT' || 
                                   document.activeElement.tagName === 'TEXTAREA';
            if (!isInputFocused) {
                this.toggleDarkMode();
            }
        }
        
        // Escape: Clear search or close mobile menu
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('search');
            if (searchInput && searchInput.value) {
                searchInput.value = '';
                searchInput.dispatchEvent(new Event('input'));
            }
            
            // Close mobile menu if open
            const mobileMenuToggle = document.getElementById('mobileMenuToggle');
            if (mobileMenuToggle && mobileMenuToggle.classList.contains('active')) {
                mobileMenuToggle.click();
            }
        }
        
        // / key: Focus search
        if (e.key === '/' && !e.ctrlKey && !e.metaKey) {
            const isInputFocused = document.activeElement.tagName === 'INPUT' || 
                                   document.activeElement.tagName === 'TEXTAREA';
            if (!isInputFocused) {
                e.preventDefault();
                const searchInput = document.getElementById('search');
                if (searchInput) searchInput.focus();
            }
        }
    }
    
    /**
     * Toggle dark/light mode
     */
    toggleDarkMode() {
        this.darkMode = !this.darkMode;
        document.body.classList.toggle('light-mode', !this.darkMode);
        
        // Show message
        if (window.animations) {
            window.animations.showMessage(1, 2000);
        }
    }
    
    /**
     * Set up scroll to top button
     */
    setupScrollToTop() {
        const scrollTopBtn = document.getElementById('scrollTop');
        
        if (scrollTopBtn) {
            scrollTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }
    
    /**
     * Set up smooth scrolling for anchor links
     */
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', (e) => {
                const targetId = anchor.getAttribute('href');
                
                if (targetId === '#') return;
                
                // Let navigation.js handle nav links
                if (anchor.dataset.nav) return;
                
                const target = document.querySelector(targetId);
                
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({
                        behavior: 'smooth'
                    });
                }
            });
        });
    }
    
    /**
     * Check for reduced motion preference
     */
    checkReducedMotion() {
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
        
        if (prefersReducedMotion.matches) {
            console.log('Reduced motion preference detected');
        }
    }
    
    /**
     * Set up time display in footer
     */
    setupTimeDisplay() {
        const timeElement = document.getElementById('currentTime');
        
        if (timeElement) {
            const updateTime = () => {
                const now = new Date();
                const hours = String(now.getHours()).padStart(2, '0');
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const seconds = String(now.getSeconds()).padStart(2, '0');
                timeElement.textContent = `${hours}:${minutes}:${seconds}`;
            };
            
            // Update immediately
            updateTime();
            
            // Update every second
            setInterval(updateTime, 1000);
        }
    }
    
    /**
     * Utility: Debounce function
     */
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
    
    /**
     * Utility: Throttle function
     */
    static throttle(func, limit) {
        let inThrottle;
        return function executedFunction(...args) {
            if (!inThrottle) {
                func(...args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
}

// Initialize app
window.app = new App();

