/**
 * ============================================
 * IMAGE-LOADER.JS
 * High-performance image loading system
 * Provides instant image display through preloading,
 * caching, and intelligent prefetching
 * ============================================
 */

class ImageLoader {
    constructor() {
        // Image cache stores loaded image URLs
        this.cache = new Map();
        
        // Queue for images to preload
        this.preloadQueue = [];
        this.isPreloading = false;
        
        // Track loading states
        this.loadingImages = new Set();
        
        // Configuration
        this.config = {
            // Number of concurrent preloads
            concurrentPreloads: 4,
            // Prefetch images within this viewport margin
            prefetchMargin: '200px',
            // Enable debug logging
            debug: false
        };
        
        // Initialize
        this.init();
    }
    
    init() {
        // Preload critical images immediately
        this.preloadCriticalImages();
        
        // Set up lazy loading for images with data-src
        this.setupLazyLoading();
        
        // Set up prefetching for project previews
        this.setupPreviewPrefetching();
        
        // Listen for dynamic content
        this.observeDynamicContent();
        
        this.log('ImageLoader initialized');
    }
    
    /**
     * Preload critical above-the-fold images
     * These load immediately for instant display
     */
    preloadCriticalImages() {
        // Find critical images (profile photo, visible images)
        const criticalSelectors = [
            '.home-image img',
            'img[fetchpriority="high"]',
            'img[data-critical="true"]'
        ];
        
        criticalSelectors.forEach(selector => {
            document.querySelectorAll(selector).forEach(img => {
                if (img.src) {
                    this.preloadImage(img.src, true);
                }
            });
        });
    }
    
    /**
     * Preload a single image
     * @param {string} src - Image URL
     * @param {boolean} highPriority - Load immediately vs queued
     * @returns {Promise} Resolves when image is loaded
     */
    preloadImage(src, highPriority = false) {
        // Return cached promise if already loaded/loading
        if (this.cache.has(src)) {
            return this.cache.get(src);
        }
        
        // Create loading promise
        const loadPromise = new Promise((resolve, reject) => {
            const img = new Image();
            
            // Use decode() for smoother rendering
            img.onload = () => {
                if (img.decode) {
                    img.decode()
                        .then(() => {
                            this.log(`Loaded: ${src}`);
                            resolve(src);
                        })
                        .catch(() => {
                            // Decode failed but image loaded
                            resolve(src);
                        });
                } else {
                    resolve(src);
                }
            };
            
            img.onerror = () => {
                this.cache.delete(src);
                reject(new Error(`Failed to load: ${src}`));
            };
            
            // Set crossorigin for CORS images
            if (src.startsWith('http') && !src.includes(window.location.hostname)) {
                img.crossOrigin = 'anonymous';
            }
            
            img.src = src;
        });
        
        // Cache the promise
        this.cache.set(src, loadPromise);
        
        return loadPromise;
    }
    
    /**
     * Preload multiple images with controlled concurrency
     * @param {string[]} urls - Array of image URLs
     * @returns {Promise} Resolves when all images loaded
     */
    async preloadImages(urls) {
        const uniqueUrls = [...new Set(urls)].filter(url => !this.cache.has(url));
        
        if (uniqueUrls.length === 0) return;
        
        this.log(`Preloading ${uniqueUrls.length} images`);
        
        // Process in batches for controlled concurrency
        const batches = [];
        for (let i = 0; i < uniqueUrls.length; i += this.config.concurrentPreloads) {
            batches.push(uniqueUrls.slice(i, i + this.config.concurrentPreloads));
        }
        
        for (const batch of batches) {
            await Promise.allSettled(batch.map(url => this.preloadImage(url)));
        }
    }
    
    /**
     * Set up Intersection Observer for lazy loading
     * Images with data-src attribute load when near viewport
     */
    setupLazyLoading() {
        if (!('IntersectionObserver' in window)) {
            // Fallback: load all images immediately
            document.querySelectorAll('img[data-src]').forEach(img => {
                img.src = img.dataset.src;
            });
            return;
        }
        
        const lazyObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        this.loadLazyImage(img);
                        lazyObserver.unobserve(img);
                    }
                });
            },
            {
                rootMargin: this.config.prefetchMargin,
                threshold: 0
            }
        );
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            lazyObserver.observe(img);
        });
        
        // Store observer for dynamic content
        this.lazyObserver = lazyObserver;
    }
    
    /**
     * Load a lazy image with fade-in effect
     * @param {HTMLImageElement} img - Image element to load
     */
    async loadLazyImage(img) {
        const src = img.dataset.src;
        if (!src) return;
        
        try {
            // Preload first
            await this.preloadImage(src);
            
            // Apply loaded class for CSS transition
            img.src = src;
            img.removeAttribute('data-src');
            img.classList.add('loaded');
            
            // Also set lazy attribute for CSS selectors
            img.setAttribute('lazy', 'loaded');
        } catch (error) {
            this.log(`Failed to lazy load: ${src}`);
            img.classList.add('load-error');
        }
    }
    
    /**
     * Set up prefetching for project preview images
     * Loads images before user hovers for instant display
     */
    setupPreviewPrefetching() {
        // Collect all preview image URLs
        const previewUrls = this.collectPreviewUrls();
        
        // Preload after initial page load settles
        if (previewUrls.length > 0) {
            // Use requestIdleCallback or setTimeout fallback
            const schedulePreload = window.requestIdleCallback || 
                ((cb) => setTimeout(cb, 100));
            
            schedulePreload(() => {
                this.preloadImages(previewUrls);
            });
        }
        
        // Also set up hover-based prefetching as backup
        this.setupHoverPrefetch();
    }
    
    /**
     * Collect all preview image URLs from project items
     * @returns {string[]} Array of image URLs
     */
    collectPreviewUrls() {
        const urls = [];
        
        document.querySelectorAll('[data-preview]').forEach(element => {
            const previewData = element.dataset.preview;
            if (previewData) {
                try {
                    const images = JSON.parse(previewData);
                    if (Array.isArray(images)) {
                        urls.push(...images);
                    } else {
                        urls.push(images);
                    }
                } catch (e) {
                    urls.push(previewData);
                }
            }
        });
        
        return urls;
    }
    
    /**
     * Set up hover-based prefetching for project items
     * Starts loading on mouseenter even if idle preload hasn't completed
     */
    setupHoverPrefetch() {
        document.querySelectorAll('[data-preview]').forEach(element => {
            element.addEventListener('mouseenter', () => {
                const previewData = element.dataset.preview;
                if (previewData) {
                    try {
                        const images = JSON.parse(previewData);
                        const imageArray = Array.isArray(images) ? images : [images];
                        
                        // Preload all images for this preview
                        imageArray.forEach(url => {
                            if (!this.cache.has(url)) {
                                this.preloadImage(url, true);
                            }
                        });
                    } catch (e) {
                        if (!this.cache.has(previewData)) {
                            this.preloadImage(previewData, true);
                        }
                    }
                }
            }, { passive: true });
        });
    }
    
    /**
     * Observe DOM for dynamically added content
     * Automatically applies lazy loading to new images
     */
    observeDynamicContent() {
        if (!('MutationObserver' in window)) return;
        
        const contentObserver = new MutationObserver((mutations) => {
            mutations.forEach(mutation => {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Handle lazy images
                        if (node.matches && node.matches('img[data-src]')) {
                            this.lazyObserver?.observe(node);
                        }
                        node.querySelectorAll?.('img[data-src]').forEach(img => {
                            this.lazyObserver?.observe(img);
                        });
                        
                        // Handle preview elements
                        if (node.matches && node.matches('[data-preview]')) {
                            this.setupElementHoverPrefetch(node);
                        }
                        node.querySelectorAll?.('[data-preview]').forEach(el => {
                            this.setupElementHoverPrefetch(el);
                        });
                    }
                });
            });
        });
        
        contentObserver.observe(document.body, {
            childList: true,
            subtree: true
        });
    }
    
    /**
     * Set up hover prefetch for a single element
     * @param {HTMLElement} element - Element with data-preview
     */
    setupElementHoverPrefetch(element) {
        element.addEventListener('mouseenter', () => {
            const previewData = element.dataset.preview;
            if (previewData) {
                try {
                    const images = JSON.parse(previewData);
                    const imageArray = Array.isArray(images) ? images : [images];
                    imageArray.forEach(url => this.preloadImage(url, true));
                } catch (e) {
                    this.preloadImage(previewData, true);
                }
            }
        }, { passive: true });
    }
    
    /**
     * Check if an image is cached and ready
     * @param {string} url - Image URL
     * @returns {boolean} Whether image is cached
     */
    isCached(url) {
        return this.cache.has(url);
    }
    
    /**
     * Get a cached image URL, waiting if necessary
     * @param {string} url - Image URL
     * @returns {Promise<string>} Resolved URL
     */
    async getImage(url) {
        if (!this.cache.has(url)) {
            await this.preloadImage(url, true);
        }
        return this.cache.get(url);
    }
    
    /**
     * Manually preload images from an array
     * Useful for dynamic content
     * @param {string[]} urls - URLs to preload
     */
    addToCache(urls) {
        const urlArray = Array.isArray(urls) ? urls : [urls];
        this.preloadImages(urlArray);
    }
    
    /**
     * Refresh image loading for dynamically loaded content
     * Call after adding new project items
     */
    refresh() {
        // Re-collect and preload preview URLs
        const previewUrls = this.collectPreviewUrls();
        this.preloadImages(previewUrls);
        
        // Re-setup hover prefetching
        this.setupHoverPrefetch();
        
        this.log('ImageLoader refreshed');
    }
    
    /**
     * Debug logging
     * @param {string} message - Message to log
     */
    log(message) {
        if (this.config.debug) {
            console.log(`[ImageLoader] ${message}`);
        }
    }
}

// Initialize and expose globally
window.imageLoader = new ImageLoader();
