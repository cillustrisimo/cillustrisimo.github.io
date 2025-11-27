/**
 * ============================================
 * CONTENT-LOADER.JS
 * Loads dynamic content from JSON data files
 * ============================================
 */

class ContentLoader {
    constructor() {
        this.updatesContainer = document.getElementById('updatesContent');
        this.projectsContainer = document.getElementById('projectList');
        
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
            
            this.renderProjects(data.projects);
        } catch (error) {
            console.error('Failed to load projects:', error);
            this.projectsContainer.innerHTML = `
                <div class="project-item active">
                    <ul class="project-content">
                        <li class="project-column year"><p>-</p></li>
                        <li class="project-column title"><p>Failed to load projects</p></li>
                        <li class="project-column category"><p>-</p></li>
                        <li class="project-column preview">
                            <div class="preview-image"></div>
                        </li>
                    </ul>
                </div>
            `;
        }
    }
    
    /**
 * Render projects to the DOM
 */
renderProjects(projects) {
    if (!projects || projects.length === 0) {
        this.projectsContainer.innerHTML = `
            <div class="project-item active">
                <ul class="project-content">
                    <li class="project-column year"><p>-</p></li>
                    <li class="project-column title"><p>No projects available</p></li>
                    <li class="project-column category"><p>-</p></li>
                    <li class="project-column preview">
                        <div class="preview-image"></div>
                    </li>
                </ul>
            </div>
        `;
        return;
    }
    
    const html = projects.map(project => {
        // Logic: If a link exists, use an <a> tag, otherwise use a <div>
        const tag = project.link ? 'a' : 'div';
        const linkAttrs = project.link 
            ? `href="${project.link}" target="_blank" rel="noopener noreferrer"` 
            : '';
        
        return `
            <${tag} class="project-item active cursor-interact"
                 ${linkAttrs}
                 data-id="${project.id}"
                 data-year="${project.year}"
                 data-title="${project.title}"
                 data-category="${project.category}">
                <ul class="project-content">
                    <li class="project-column year"><p>${project.year}</p></li>
                    <li class="project-column title"><p>${project.title}</p></li>
                    <li class="project-column category"><p>${project.category}</p></li>
                    <li class="project-column preview">
                        <div class="preview-image" ${project.previewImage ? `style="background-image: url('${project.previewImage}')"` : ''}>
                            ${!project.previewImage ? '<span class="preview-placeholder">Preview</span>' : ''}
                        </div>
                    </li>
                </ul>
            </${tag}>
        `;
    }).join('');
    
    this.projectsContainer.innerHTML = html;
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
    /**
 * Add a single project dynamically
 */
addProject(project) {
    // Determine tag type based on link existence
    const tag = project.link ? 'a' : 'div';
    const projectElement = document.createElement(tag);
    
    projectElement.className = 'project-item active cursor-interact';
    projectElement.dataset.id = project.id;
    projectElement.dataset.year = project.year;
    projectElement.dataset.title = project.title;
    projectElement.dataset.category = project.category;
    
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
            <li class="project-column preview">
                <div class="preview-image" ${project.previewImage ? `style="background-image: url('${project.previewImage}')"` : ''}>
                    ${!project.previewImage ? '<span class="preview-placeholder">Preview</span>' : ''}
                </div>
            </li>
        </ul>
    `;
    
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
