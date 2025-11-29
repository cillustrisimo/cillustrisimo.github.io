/**
 * ============================================
 * INTERACTIONS.JS
 * Project list filtering, sorting, and search
 * ============================================
 */

class ProjectList {
    constructor() {
        // Elements
        this.projectList = document.getElementById('projectList');
        this.projects = [];
        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.searchInput = document.getElementById('search');
        
        // State
        this.currentSort = 'year';
        this.sortDirection = 'desc'; // desc = newest first
        this.searchQuery = '';
        
        // Bind methods
        this.onFilterClick = this.onFilterClick.bind(this);
        this.onSearch = this.onSearch.bind(this);
        
        // Initialize
        this.init();
    }
    
    init() {
        if (!this.projectList) return;
        
        // Cache project data
        this.cacheProjects();
        
        // Set up filter buttons
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', this.onFilterClick);
        });
        
        // Set up search
        if (this.searchInput) {
            this.searchInput.addEventListener('input', this.onSearch);
        }
        
        // Set up project click handlers
        this.setupProjectClicks();
    }
    
    /**
     * Cache project elements and their data
     */
    cacheProjects() {
        const projectElements = this.projectList.querySelectorAll('.project-item');
        
        this.projects = Array.from(projectElements).map(el => {
            // Parse preview data - can be string or JSON array
            let preview = null;
            if (el.dataset.preview) {
                try {
                    preview = JSON.parse(el.dataset.preview);
                } catch (e) {
                    preview = el.dataset.preview;
                }
            }
            
            return {
                element: el,
                id: el.dataset.id,
                year: parseInt(el.dataset.year) || 0,
                title: el.dataset.title?.toLowerCase() || '',
                category: el.dataset.category?.toLowerCase() || '',
                preview: preview
            };
        });
        
        // Re-setup click handlers after caching
        this.setupProjectClicks();
        
        // Re-setup hover listeners
        this.setupHoverListeners();
    }
    
    /**
     * Handle filter button clicks
     */
    onFilterClick(e) {
        const btn = e.currentTarget;
        const sortKey = btn.dataset.sort;
        
        // Toggle direction if same sort, otherwise reset to desc
        if (this.currentSort === sortKey) {
            this.sortDirection = this.sortDirection === 'desc' ? 'asc' : 'desc';
        } else {
            this.currentSort = sortKey;
            this.sortDirection = 'desc';
        }
        
        // Update active states
        this.filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        // Sort and render
        this.sortProjects();
        this.renderProjects();
    }
    
    /**
     * Handle search input
     */
    onSearch(e) {
        this.searchQuery = e.target.value.toLowerCase().trim();
        this.filterProjects();
    }
    
    /**
     * Sort projects array
     */
    sortProjects() {
        const key = this.currentSort;
        const dir = this.sortDirection === 'desc' ? -1 : 1;
        
        this.projects.sort((a, b) => {
            let valA = a[key];
            let valB = b[key];
            
            // Handle string comparison
            if (typeof valA === 'string') {
                return valA.localeCompare(valB) * dir;
            }
            
            // Handle number comparison
            return (valA - valB) * dir;
        });
    }
    
    /**
     * Filter projects based on search query
     */
    filterProjects() {
        this.projects.forEach(project => {
            const matches = !this.searchQuery || 
                project.title.includes(this.searchQuery) ||
                project.category.includes(this.searchQuery) ||
                project.year.toString().includes(this.searchQuery);
            
            if (matches) {
                project.element.style.display = '';
                project.element.classList.add('active');
            } else {
                project.element.style.display = 'none';
                project.element.classList.remove('active');
            }
        });
    }
    
    /**
     * Re-render projects in sorted order
     */
    renderProjects() {
        // Remove all projects from DOM
        this.projects.forEach(project => {
            this.projectList.removeChild(project.element);
        });
        
        // Re-add in sorted order
        this.projects.forEach(project => {
            this.projectList.appendChild(project.element);
        });
        
        // Apply current filter
        this.filterProjects();
        
        // Re-setup hover listeners after re-render
        this.setupHoverListeners();
    }
    
    /**
     * Set up project click handlers
     */
    setupProjectClicks() {
        this.projects.forEach(project => {
            // Remove existing listeners to avoid duplicates
            const newElement = project.element.cloneNode(true);
            project.element.parentNode?.replaceChild(newElement, project.element);
            project.element = newElement;
            
            project.element.addEventListener('click', () => {
                this.onProjectClick(project);
            });
        });
    }
    
    /**
     * Set up hover listeners for projects with previews
     * Works with the fixed preview box system
     */
    setupHoverListeners() {
        // Only set up if contentLoader exists
        if (!window.contentLoader) return;
        
        this.projects.forEach(project => {
            if (project.preview) {
                project.element.addEventListener('mouseenter', () => {
                    window.contentLoader.showPreviewBox(project.preview);
                });
                
                project.element.addEventListener('mouseleave', () => {
                    window.contentLoader.hidePreviewBox();
                });
            }
        });
    }
    
    /**
     * Handle project click
     */
    onProjectClick(project) {
        console.log('Project clicked:', project.id);
        window.dispatchEvent(new CustomEvent('projectSelected', {
            detail: project
        }));
    }
    
    /**
     * Add a new project dynamically
     */
    addProject(projectData) {
        // Create element
        const template = this.createProjectElement(projectData);
        
        // Add to DOM and cache
        this.projectList.appendChild(template);
        
        // Re-cache and sort
        this.cacheProjects();
        this.sortProjects();
        this.renderProjects();
        
        // Refresh cursor interactions
        if (window.customCursor) {
            window.customCursor.refresh();
        }
    }
    
    /**
     * Create a project element from data
     * Supports both previewImage (string) and previewImages (array)
     */
    createProjectElement(data) {
        const tag = data.link ? 'a' : 'div';
        const element = document.createElement(tag);
        
        element.className = 'project-item active cursor-interact';
        element.dataset.id = data.id;
        element.dataset.year = data.year;
        element.dataset.title = data.title;
        element.dataset.category = data.category;
        
        // Handle preview images - support both formats
        if (data.previewImages && Array.isArray(data.previewImages)) {
            element.dataset.preview = JSON.stringify(data.previewImages);
        } else if (data.previewImage) {
            if (Array.isArray(data.previewImage)) {
                element.dataset.preview = JSON.stringify(data.previewImage);
            } else {
                element.dataset.preview = JSON.stringify([data.previewImage]);
            }
        }
        
        if (data.link) {
            element.href = data.link;
            element.target = "_blank";
            element.rel = "noopener noreferrer";
        }
        
        element.innerHTML = `
            <ul class="project-content">
                <li class="project-column year"><p>${data.year}</p></li>
                <li class="project-column title"><p>${data.title}</p></li>
                <li class="project-column category"><p>${data.category}</p></li>
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
        
        return element;
    }
}

// Initialize project list
window.projectList = new ProjectList();
