/**
 * ============================================
 * CONTENT-LOADER.JS
 * Loads dynamic content from JSON data files
 * Integrates with ImageLoader for instant image display
 * ============================================
 */

class ContentLoader {
    constructor() {
        this.updatesContainer = document.getElementById('updatesContent');
        this.projectsContainer = document.getElementById('projectList');
        this.previewBox = document.getElementById('project-preview-box');
        this.previewImg = document.getElementById('preview-box-img');
        this.previewIndicators = document.getElementById('preview-indicators');
        
        // Slideshow state
        this.currentImages = [];
        this.currentImageIndex = 0;
        this.slideshowInterval = null;
        this.slideshowDelay = 2500;
        this.isPreviewVisible = false;
        
        // Image preload state for smooth transitions
        this.preloadedImages = new Set();
        
        // Check if device supports hover (desktop)
        this.supportsHover = window.matchMedia('(hover: hover)').matches;
        
        // Initialize
        this.init();
    }
    
    async init() {
        await Promise.all([
            this.loadUpdates(),
            this.loadProjects()
        ]);
        
        // Refresh cursor interactions after content loads
        if (window.customCursor) {
            window.customCursor.refresh();
        }
        
        // Re-initialize project list functionality
        if (window.projectList) {
            window.projectList.cacheProjects();
        }
        
        // Refresh image loader for new content
        if (window.imageLoader) {
            window.imageLoader.refresh();
        }
        
        // Listen for page changes to preload images when entering projects
        window.addEventListener('pageChange', (e) => {
            if (e.detail.page === 'projects') {
                this.preloadAllPreviewImages();
            }
        });
        
        // Also preload if already on projects page
        if (window.location.hash === '#projects') {
            this.preloadAllPreviewImages();
        }
    }
    
    /**
     * Preload images for a set of URLs
     * Uses ImageLoader if available, falls back to basic preload
     * @param {string[]} urls - Array of image URLs
     */
    async preloadImages(urls) {
        if (window.imageLoader) {
            window.imageLoader.addToCache(urls);
        } else {
            // Fallback preloading
            urls.forEach(url => {
                if (!this.preloadedImages.has(url)) {
                    const img = new Image();
                    img.src = url;
                    this.preloadedImages.add(url);
                }
            });
        }
    }
    
    /**
     * Check if an image is ready for instant display
     * @param {string} url - Image URL
     * @returns {boolean} Whether image is cached
     */
    isImageReady(url) {
        if (window.imageLoader) {
            return window.imageLoader.isCached(url);
        }
        return this.preloadedImages.has(url);
    }
    
    /**
     * Show preview box with image(s)
     * @param {string|string[]} images - Single image URL or array of image URLs
     */
    showPreviewBox(images) {
        if (!this.previewBox || !this.previewImg || !this.supportsHover) return;
        
        // Normalize to array
        this.currentImages = Array.isArray(images) ? images : [images];
        this.currentImageIndex = 0;
        
        // Clear any existing slideshow
        this.stopSlideshow();
        
        // Show first image
        this.updatePreviewImage(true);
        
        // Update indicators
        this.updateIndicators();
        
        // Show the preview box
        this.previewBox.classList.add('is-visible');
        this.isPreviewVisible = true;
        
        // Start slideshow if multiple images
        if (this.currentImages.length > 1) {
            this.startSlideshow();
        }
    }
    
    /**
     * Preload ALL preview images immediately
     * Call this when entering projects page to ensure smooth slideshows
     */
    preloadAllPreviewImages() {
        const allUrls = [];
        
        document.querySelectorAll('[data-preview]').forEach(el => {
            try {
                const images = JSON.parse(el.dataset.preview);
                if (Array.isArray(images)) {
                    allUrls.push(...images);
                } else {
                    allUrls.push(images);
                }
            } catch (e) {
                allUrls.push(el.dataset.preview);
            }
        });
        
        // Preload all unique URLs
        const uniqueUrls = [...new Set(allUrls)];
        uniqueUrls.forEach(url => {
            if (!this.preloadedImages.has(url)) {
                const img = new Image();
                img.src = url;
                this.preloadedImages.add(url);
            }
        });
    }
    
    /**
     * Hide preview box
     */
    hidePreviewBox() {
        if (!this.previewBox) return;
        
        this.previewBox.classList.remove('is-visible');
        this.isPreviewVisible = false;
        this.stopSlideshow();
    }
    
    /**
     * Update the preview image display
     * Skips transition if image is already cached
     * @param {boolean} instant - Skip fade transition
     */
    updatePreviewImage(instant = false) {
        if (!this.previewImg || this.currentImages.length === 0) return;
        
        const imageUrl = this.currentImages[this.currentImageIndex];
        const isReady = this.isImageReady(imageUrl);
        
        if (instant || isReady) {
            // Instant display - no transition needed
            this.previewImg.style.backgroundImage = `url('${imageUrl}')`;
            this.previewImg.classList.remove('transitioning');
            this.previewImg.classList.add('loaded');
            this.updateIndicatorActive();
        } else {
            // Add fade transition for uncached images
            this.previewImg.classList.add('transitioning');
            
            // Load the image first
            const img = new Image();
            img.onload = () => {
                this.previewImg.style.backgroundImage = `url('${imageUrl}')`;
                this.previewImg.classList.remove('transitioning');
                this.previewImg.classList.add('loaded');
                this.updateIndicatorActive();
                
                // Mark as preloaded
                this.preloadedImages.add(imageUrl);
            };
            img.src = imageUrl;
        }
    }
    
    /**
     * Update indicator dots for slideshow
     */
    updateIndicators() {
        if (!this.previewIndicators) return;
        
        // Clear existing indicators
        this.previewIndicators.innerHTML = '';
        
        // Only show indicators if multiple images
        if (this.currentImages.length <= 1) {
            this.previewIndicators.style.display = 'none';
            return;
        }
        
        this.previewIndicators.style.display = 'flex';
        
        // Create indicator dots
        this.currentImages.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.className = 'preview-indicator-dot';
            if (index === this.currentImageIndex) {
                dot.classList.add('active');
            }
            this.previewIndicators.appendChild(dot);
        });
    }
    
    /**
     * Update which indicator is active
     */
    updateIndicatorActive() {
        if (!this.previewIndicators) return;
        
        const dots = this.previewIndicators.querySelectorAll('.preview-indicator-dot');
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentImageIndex);
        });
    }
    
    /**
     * Start slideshow cycling through images
     */
    startSlideshow() {
        if (this.currentImages.length <= 1) return;
        
        this.slideshowInterval = setInterval(() => {
            this.currentImageIndex = (this.currentImageIndex + 1) % this.currentImages.length;
            this.updatePreviewImage();
        }, this.slideshowDelay);
    }
    
    /**
     * Stop the slideshow
     */
    stopSlideshow() {
        if (this.slideshowInterval) {
            clearInterval(this.slideshowInterval);
            this.slideshowInterval = null;
        }
    }
    
    /**
     * Load updates from JSON file
     */
    async loadUpdates() {
        if (!this.updatesContainer) return;
        
        try {
            const response = await fetch('data/updates.json');
            const data = await response.json();
            
            this.renderUpdates(data.updates);
        } catch (error) {
            console.error('Failed to load updates:', error);
            this.updatesContainer.innerHTML = `
                <div class="update-item">
                    <span class="update-date">Error</span>
                    <span class="update-text">Failed to load updates. Please refresh the page.</span>
                </div>
            `;
        }
    }
    
    /**
     * Render updates to the DOM
     */
    renderUpdates(updates) {
        if (!updates || updates.length === 0) {
            this.updatesContainer.innerHTML = `
                <div class="update-item">
                    <span class="update-date">-</span>
                    <span class="update-text">No updates available.</span>
                </div>
            `;
            return;
        }
        
        const html = updates.map(update => {
            const linkHtml = update.link 
                ? ` <a href="${update.link}" class="update-link">${update.linkText || '(link)'}</a>` 
                : '';
            
            return `
                <div class="update-item">
                    <span class="update-date">${update.date}</span>
                    <span class="update-text">${update.text}${linkHtml}</span>
                </div>
            `;
        }).join('');
        
        this.updatesContainer.innerHTML = html;
    }
    
    /**
     * Load projects from JSON file
     */
    async loadProjects() {
        if (!this.projectsContainer) return;
        
        try {
            const response = await fetch('data/projects.json');
            const data = await response.json();
            
            // Collect all preview images for preloading
            const previewImages = [];
            data.projects.forEach(project => {
                if (project.previewImages && Array.isArray(project.previewImages)) {
                    previewImages.push(...project.previewImages);
                } else if (project.previewImage) {
                    if (Array.isArray(project.previewImage)) {
                        previewImages.push(...project.previewImage);
                    } else {
                        previewImages.push(project.previewImage);
                    }
                }
            });
            
            // Start preloading images immediately
            this.preloadImages(previewImages);
            
            this.renderProjects(data.projects);
        } catch (error) {
            console.error('Failed to load projects:', error);
            this.projectsContainer.innerHTML = `
                <div class="project-item active">
                    <ul class="project-content">
                        <li class="project-column year"><p>-</p></li>
                        <li class="project-column title"><p>Failed to load projects</p></li>
                        <li class="project-column category"><p>-</p></li>
                        <li class="project-column arrow">
                            <span class="project-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </span>
                        </li>
                    </ul>
                </div>
            `;
        }
    }
    
    /**
     * Render projects to the DOM
     * Supports both single previewImage (string) and previewImage(s) (array)
     */
    renderProjects(projects) {
        if (!projects || projects.length === 0) {
            this.projectsContainer.innerHTML = `
                <div class="project-item active">
                    <ul class="project-content">
                        <li class="project-column year"><p>-</p></li>
                        <li class="project-column title"><p>No projects available</p></li>
                        <li class="project-column category"><p>-</p></li>
                        <li class="project-column arrow">
                            <span class="project-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </span>
                        </li>
                    </ul>
                </div>
            `;
            return;
        }
        
        const html = projects.map(project => {
            const tag = project.link ? 'a' : 'div';
            const linkAttrs = project.link 
                ? `href="${project.link}" target="_blank" rel="noopener noreferrer"` 
                : '';
            
            // Support both previewImage (string) and previewImages (array)
            let previewAttr = '';
            if (project.previewImages && Array.isArray(project.previewImages)) {
                previewAttr = `data-preview='${JSON.stringify(project.previewImages)}'`;
            } else if (project.previewImage) {
                if (Array.isArray(project.previewImage)) {
                    previewAttr = `data-preview='${JSON.stringify(project.previewImage)}'`;
                } else {
                    previewAttr = `data-preview='${JSON.stringify([project.previewImage])}'`;
                }
            }
            
            return `
                <${tag} class="project-item active cursor-interact"
                     ${linkAttrs}
                     data-id="${project.id}"
                     data-year="${project.year}"
                     data-title="${project.title}"
                     data-category="${project.category}"
                     ${previewAttr}>
                    <ul class="project-content">
                        <li class="project-column year"><p>${project.year}</p></li>
                        <li class="project-column title"><p>${project.title}</p></li>
                        <li class="project-column category"><p>${project.category}</p></li>
                        <li class="project-column arrow">
                            <span class="project-arrow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12"></line>
                                    <polyline points="12 5 19 12 12 19"></polyline>
                                </svg>
                            </span>
                        </li>
                    </ul>
                </${tag}>
            `;
        }).join('');
        
        this.projectsContainer.innerHTML = html;
        
        // Set up hover listeners after rendering
        this.setupHoverListeners();
    }
    
    /**
     * Set up hover listeners for project items
     */
    setupHoverListeners() {
        const projectItems = this.projectsContainer.querySelectorAll('.project-item[data-preview]');
        
        projectItems.forEach(item => {
            item.addEventListener('mouseenter', () => {
                const previewData = item.dataset.preview;
                if (previewData) {
                    try {
                        const images = JSON.parse(previewData);
                        this.showPreviewBox(images);
                    } catch (e) {
                        this.showPreviewBox(previewData);
                    }
                }
            });
            
            item.addEventListener('mouseleave', () => {
                this.hidePreviewBox();
            });
        });
    }
    
    /**
     * Add a single update dynamically
     */
    addUpdate(update) {
        const updateElement = document.createElement('div');
        updateElement.className = 'update-item';
        
        const linkHtml = update.link 
            ? ` <a href="${update.link}" class="update-link">${update.linkText || '(link)'}</a>` 
            : '';
        
        updateElement.innerHTML = `
            <span class="update-date">${update.date}</span>
            <span class="update-text">${update.text}${linkHtml}</span>
        `;
        
        // Insert at the beginning
        this.updatesContainer.insertBefore(updateElement, this.updatesContainer.firstChild);
    }
    
    /**
     * Add a single project dynamically
     */
    addProject(project) {
        const tag = project.link ? 'a' : 'div';
        const projectElement = document.createElement(tag);
        
        projectElement.className = 'project-item active cursor-interact';
        projectElement.dataset.id = project.id;
        projectElement.dataset.year = project.year;
        projectElement.dataset.title = project.title;
        projectElement.dataset.category = project.category;
        
        // Handle preview images
        let previewImages = null;
        if (project.previewImages && Array.isArray(project.previewImages)) {
            projectElement.dataset.preview = JSON.stringify(project.previewImages);
            previewImages = project.previewImages;
        } else if (project.previewImage) {
            if (Array.isArray(project.previewImage)) {
                projectElement.dataset.preview = JSON.stringify(project.previewImage);
                previewImages = project.previewImage;
            } else {
                projectElement.dataset.preview = JSON.stringify([project.previewImage]);
                previewImages = [project.previewImage];
            }
        }
        
        // Preload images for this project
        if (previewImages) {
            this.preloadImages(previewImages);
        }
        
        if (project.link) {
            projectElement.href = project.link;
            projectElement.target = "_blank";
            projectElement.rel = "noopener noreferrer";
        }
        
        projectElement.innerHTML = `
            <ul class="project-content">
                <li class="project-column year"><p>${project.year}</p></li>
                <li class="project-column title"><p>${project.title}</p></li>
                <li class="project-column category"><p>${project.category}</p></li>
                <li class="project-column arrow">
                    <span class="project-arrow">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                            <line x1="5" y1="12" x2="19" y2="12"></line>
                            <polyline points="12 5 19 12 12 19"></polyline>
                        </svg>
                    </span>
                </li>
            </ul>
        `;
        
        // Add hover listeners if has preview
        if (previewImages) {
            projectElement.addEventListener('mouseenter', () => {
                this.showPreviewBox(previewImages);
            });
            
            projectElement.addEventListener('mouseleave', () => {
                this.hidePreviewBox();
            });
        }
        
        this.projectsContainer.appendChild(projectElement);
        
        // Re-cache projects
        if (window.projectList) {
            window.projectList.cacheProjects();
        }
        
        // Refresh cursor
        if (window.customCursor) {
            window.customCursor.refresh();
        }
    }
}

// Initialize content loader when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.contentLoader = new ContentLoader();
    });
} else {
    window.contentLoader = new ContentLoader();
}
