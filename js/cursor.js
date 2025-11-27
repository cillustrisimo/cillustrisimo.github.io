/**
 * ============================================
 * CURSOR.JS
 * Custom cursor functionality
 * ============================================
 */

class CustomCursor {
    constructor() {
        // Get cursor elements
        this.cursorPrimary = document.querySelector('.cursor-primary');
        this.cursorSecondary = document.querySelector('.cursor-secondary');
        
        // Check if touch device
        this.isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        
        if (this.isTouchDevice) {
            // Hide cursors on touch devices
            if (this.cursorPrimary) this.cursorPrimary.style.display = 'none';
            if (this.cursorSecondary) this.cursorSecondary.style.display = 'none';
            return;
        }
        
        // Cursor state
        this.mouseX = window.innerWidth / 2;
        this.mouseY = window.innerHeight / 2;
        this.cursorX = this.mouseX;
        this.cursorY = this.mouseY;
        this.secondaryX = this.mouseX;
        this.secondaryY = this.mouseY;
        
        // Animation settings
        this.primarySpeed = 0.15;
        this.secondarySpeed = 0.08;
        
        // Bind methods
        this.onMouseMove = this.onMouseMove.bind(this);
        this.onMouseLeave = this.onMouseLeave.bind(this);
        this.onMouseEnter = this.onMouseEnter.bind(this);
        this.animate = this.animate.bind(this);
        
        // Initialize
        this.init();
    }
    
    init() {
        if (!this.cursorPrimary) return;
        
        // Mouse move listener
        document.addEventListener('mousemove', this.onMouseMove);
        
        // Hide cursor when leaving window
        document.addEventListener('mouseleave', this.onMouseLeave);
        document.addEventListener('mouseenter', this.onMouseEnter);
        
        // Interactive elements
        this.setupInteractiveElements();
        
        // Start animation loop
        this.animate();
    }
    
    onMouseMove(e) {
        this.mouseX = e.clientX;
        this.mouseY = e.clientY;
    }
    
    onMouseLeave() {
        if (this.cursorPrimary) this.cursorPrimary.classList.add('hidden');
        if (this.cursorSecondary) this.cursorSecondary.classList.add('hidden');
    }
    
    onMouseEnter() {
        if (this.cursorPrimary) this.cursorPrimary.classList.remove('hidden');
        if (this.cursorSecondary) this.cursorSecondary.classList.remove('hidden');
    }
    
    setupInteractiveElements() {
        // Get all interactive elements
        const interactiveElements = document.querySelectorAll('.cursor-interact, a, button');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (this.cursorPrimary) this.cursorPrimary.classList.add('active');
                if (this.cursorSecondary) this.cursorSecondary.classList.add('active');
            });
            
            el.addEventListener('mouseleave', () => {
                if (this.cursorPrimary) this.cursorPrimary.classList.remove('active');
                if (this.cursorSecondary) this.cursorSecondary.classList.remove('active');
            });
        });
    }
    
    // Refresh interactive elements (call after dynamic content)
    refresh() {
        this.setupInteractiveElements();
    }
    
    animate() {
        // Smooth follow for primary cursor
        this.cursorX += (this.mouseX - this.cursorX) * this.primarySpeed;
        this.cursorY += (this.mouseY - this.cursorY) * this.primarySpeed;
        
        // Even smoother follow for secondary cursor
        this.secondaryX += (this.mouseX - this.secondaryX) * this.secondarySpeed;
        this.secondaryY += (this.mouseY - this.secondaryY) * this.secondarySpeed;
        
        // Apply transforms
        if (this.cursorPrimary) {
            this.cursorPrimary.style.left = `${this.cursorX}px`;
            this.cursorPrimary.style.top = `${this.cursorY}px`;
        }
        
        if (this.cursorSecondary) {
            this.cursorSecondary.style.left = `${this.secondaryX}px`;
            this.cursorSecondary.style.top = `${this.secondaryY}px`;
        }
        
        requestAnimationFrame(this.animate);
    }
}

// Initialize cursor
window.customCursor = new CustomCursor();
