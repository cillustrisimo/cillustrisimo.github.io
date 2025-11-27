/**
 * ============================================
 * ANIMATIONS.JS
 * Scroll animations and entrance effects
 * ============================================
 */

class Animations {
    constructor() {
        // Animation state
        this.scrollY = 0;
        this.ticking = false;
        
        // Elements
        this.sections = document.querySelectorAll('section');
        
        // Bind methods
        this.onScroll = this.onScroll.bind(this);
        this.update = this.update.bind(this);
        
        // Initialize
        this.init();
    }
    
    init() {
        // Scroll listener
        window.addEventListener('scroll', this.onScroll, { passive: true });
        
        // Initialize entrance animations
        this.initEntranceAnimations();
        
        // Initialize intersection observer for scroll animations
        this.initScrollAnimations();
    }
    
    onScroll() {
        this.scrollY = window.pageYOffset;
        
        if (!this.ticking) {
            requestAnimationFrame(this.update);
            this.ticking = true;
        }
    }
    
    update() {
        // Add any scroll-based animations here
        this.ticking = false;
    }
    
    /**
     * Initialize entrance animations on page load
     */
    initEntranceAnimations() {
        // Stagger section animations
        this.sections.forEach((section, index) => {
            section.style.animationDelay = `${index * 0.1}s`;
        });
    }
    
    /**
     * Initialize scroll-triggered animations using Intersection Observer
     */
    initScrollAnimations() {
        // Check for Intersection Observer support
        if (!('IntersectionObserver' in window)) {
            // Fallback: show all elements
            document.querySelectorAll('.animate-on-scroll').forEach(el => {
                el.classList.add('visible');
            });
            return;
        }
        
        const observerOptions = {
            root: null,
            rootMargin: '0px 0px -10% 0px',
            threshold: 0.1
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Optionally unobserve after animation
                    // observer.unobserve(entry.target);
                }
            });
        }, observerOptions);
        
        // Observe all elements with animate-on-scroll class
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            observer.observe(el);
        });
    }
    
    /**
     * Show a toast message
     * @param {number} messageIndex - Index of message to show (1, 2, or 3)
     * @param {number} duration - How long to show message (ms)
     */
    showMessage(messageIndex, duration = 2000) {
        const messages = document.querySelector('.messages');
        if (!messages) return;
        
        // Remove all active classes
        messages.classList.remove('active-1', 'active-2', 'active-3');
        
        // Add the new active class
        messages.classList.add(`active-${messageIndex}`);
        
        // Remove after duration
        setTimeout(() => {
            messages.classList.remove(`active-${messageIndex}`);
        }, duration);
    }
}

// Initialize animations
window.animations = new Animations();
