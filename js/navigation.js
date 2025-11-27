/**
 * ============================================
 * NAVIGATION.JS
 * Page navigation and routing
 * ============================================
 */

class Navigation {
    constructor() {
        // Elements
        this.navLinks = document.querySelectorAll('[data-nav]');
        this.pageSections = document.querySelectorAll('.page-section');
        this.mobileMenuToggle = document.getElementById('mobileMenuToggle');
        this.headerNav = document.querySelector('.header-nav');
        
        // State
        this.currentPage = 'home';
        this.isMenuOpen = false;
        
        // Bind methods
        this.onNavClick = this.onNavClick.bind(this);
        this.onHashChange = this.onHashChange.bind(this);
        this.toggleMobileMenu = this.toggleMobileMenu.bind(this);
        
        // Initialize
        this.init();
    }
    
    init() {
        // Set up nav link clicks
        this.navLinks.forEach(link => {
            link.addEventListener('click', this.onNavClick);
        });
        
        // Listen for hash changes (back/forward navigation)
        window.addEventListener('hashchange', this.onHashChange);
        
        // Set up mobile menu toggle
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.addEventListener('click', this.toggleMobileMenu);
        }
        
        // Check initial hash
        this.checkInitialHash();
    }
    
    /**
     * Check URL hash on page load
     */
    checkInitialHash() {
        const hash = window.location.hash.replace('#', '');
        if (hash && this.isValidPage(hash)) {
            this.navigateTo(hash, false);
        }
    }
    
    /**
     * Handle navigation link clicks
     */
    onNavClick(e) {
        const target = e.currentTarget.dataset.nav;
        
        if (target && this.isValidPage(target)) {
            e.preventDefault();
            this.navigateTo(target);
            
            // Close mobile menu if open
            if (this.isMenuOpen) {
                this.toggleMobileMenu();
            }
        }
    }
    
    /**
     * Handle browser back/forward
     */
    onHashChange() {
        const hash = window.location.hash.replace('#', '');
        if (hash && this.isValidPage(hash)) {
            this.navigateTo(hash, false);
        }
    }
    
    /**
     * Navigate to a page
     * @param {string} page - Page ID to navigate to
     * @param {boolean} updateHash - Whether to update URL hash
     */
    navigateTo(page, updateHash = true) {
        if (page === this.currentPage) return;
        
        // Hide all pages (both section and div elements with page-section class)
        this.pageSections.forEach(section => {
            section.classList.remove('active');
        });
        
        // Show target page
        const targetSection = document.getElementById(page);
        if (targetSection) {
            targetSection.classList.add('active');
        }
        
        // Update nav link active states
        this.navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.dataset.nav === page) {
                link.classList.add('active');
            }
        });
        
        // Update hash
        if (updateHash) {
            window.history.pushState(null, '', `#${page}`);
        }
        
        // Scroll to top
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Update current page
        this.currentPage = page;
        
        // Refresh cursor interactions for new page content
        if (window.customCursor) {
            window.customCursor.refresh();
        }
        
        // Re-initialize project list if on projects page
        if (page === 'projects' && window.projectList) {
            window.projectList.cacheProjects();
        }
        
        // Dispatch navigation event
        window.dispatchEvent(new CustomEvent('pageChange', {
            detail: { page }
        }));
    }
    
    /**
     * Check if page ID is valid
     * Contact page has been removed
     */
    isValidPage(page) {
        return ['home', 'projects'].includes(page);
    }
    
    /**
     * Toggle mobile menu
     */
    toggleMobileMenu() {
        this.isMenuOpen = !this.isMenuOpen;
        
        if (this.mobileMenuToggle) {
            this.mobileMenuToggle.classList.toggle('active', this.isMenuOpen);
        }
        
        if (this.headerNav) {
            this.headerNav.classList.toggle('open', this.isMenuOpen);
        }
        
        // Prevent body scroll when menu is open
        document.body.classList.toggle('menu-open', this.isMenuOpen);
    }
    
    /**
     * Get current page
     */
    getCurrentPage() {
        return this.currentPage;
    }
}

// Initialize navigation
window.navigation = new Navigation();
